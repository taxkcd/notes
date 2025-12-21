# Rails API Development - Comprehensive Guide

## Table of Contents
- [API-Only Rails Applications](#api-only-rails-applications)
- [RESTful API Design](#restful-api-design)
- [Serialization](#serialization)
- [Versioning](#versioning)
- [Authentication & Authorization](#authentication--authorization)
- [Error Handling](#error-handling)
- [CORS](#cors)
- [Rate Limiting & Throttling](#rate-limiting--throttling)
- [API Documentation](#api-documentation)
- [GraphQL (Bonus)](#graphql-bonus)

---

## API-Only Rails Applications

### Creating an API-Only Application
```bash
rails new my_api --api
```

**What changes in API mode?**
- Removes middleware for browser applications (cookies, sessions, flash)
- ApplicationController inherits from `ActionController::API` instead of `ActionController::Base`
- Excludes view generators
- Skips assets pipeline configuration

### Converting Existing App to API-Only
```ruby
# config/application.rb
config.api_only = true

# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
end
```

### Key Differences
- No view rendering (use `render json:` or `render xml:`)
- Lighter middleware stack
- No CSRF protection by default
- No session/cookie handling (unless explicitly added)

---

## RESTful API Design

### Standard REST Conventions
```ruby
# config/routes.rb
resources :articles do
  resources :comments, only: [:index, :create]
end

namespace :api do
  namespace :v1 do
    resources :users
  end
end
```

### HTTP Methods & Status Codes
| Method | Action | Success Code | Use Case |
|--------|--------|--------------|----------|
| GET | Index/Show | 200 OK | Retrieve resources |
| POST | Create | 201 Created | Create new resource |
| PUT/PATCH | Update | 200 OK | Update existing resource |
| DELETE | Destroy | 204 No Content | Delete resource |

### Best Practices
```ruby
class Api::V1::ArticlesController < ApplicationController
  # GET /api/v1/articles
  def index
    articles = Article.all
    render json: articles, status: :ok
  end

  # POST /api/v1/articles
  def create
    article = Article.new(article_params)
    
    if article.save
      render json: article, status: :created, location: api_v1_article_url(article)
    else
      render json: { errors: article.errors }, status: :unprocessable_entity
    end
  end

  # PATCH /api/v1/articles/:id
  def update
    article = Article.find(params[:id])
    
    if article.update(article_params)
      render json: article, status: :ok
    else
      render json: { errors: article.errors }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/articles/:id
  def destroy
    article = Article.find(params[:id])
    article.destroy
    head :no_content
  end

  private

  def article_params
    params.require(:article).permit(:title, :content, :published)
  end
end
```

### Nested Resources
```ruby
# GET /api/v1/articles/:article_id/comments
def index
  article = Article.find(params[:article_id])
  comments = article.comments
  render json: comments
end
```

### Custom Actions
```ruby
resources :articles do
  member do
    post :publish
    post :unpublish
  end
  
  collection do
    get :featured
  end
end

# POST /articles/:id/publish
def publish
  @article = Article.find(params[:id])
  @article.publish!
  render json: @article, status: :ok
end
```

---

## Serialization

### Active Model Serializers (AMS)
```ruby
# Gemfile
gem 'active_model_serializers'

# app/serializers/article_serializer.rb
class ArticleSerializer < ActiveModel::Serializer
  attributes :id, :title, :content, :published_at, :slug
  
  belongs_to :author, serializer: UserSerializer
  has_many :comments, serializer: CommentSerializer
  
  # Custom attribute
  attribute :comment_count do
    object.comments.count
  end
  
  # Conditional attributes
  attribute :draft_content, if: :draft?
  
  def draft?
    object.status == 'draft'
  end
end

# Controller
def show
  article = Article.find(params[:id])
  render json: article, serializer: ArticleSerializer
end
```

### Fast JSON API (Netflix)
```ruby
# Gemfile
gem 'fast_jsonapi'

# app/serializers/article_serializer.rb
class ArticleSerializer
  include JSONAPI::Serializer
  
  attributes :title, :content, :published_at
  
  belongs_to :author, serializer: UserSerializer
  has_many :comments, serializer: CommentSerializer
  
  attribute :comment_count do |object|
    object.comments.count
  end
end

# Controller
render json: ArticleSerializer.new(articles).serializable_hash.to_json
```

### Blueprint
```ruby
# Gemfile
gem 'blueprinter'

# app/blueprints/article_blueprint.rb
class ArticleBlueprint < Blueprinter::Base
  identifier :id
  
  fields :title, :content, :published_at
  
  association :author, blueprint: UserBlueprint
  association :comments, blueprint: CommentBlueprint
  
  field :comment_count do |article|
    article.comments.count
  end
end

# Controller
render json: ArticleBlueprint.render(articles)
```

### JBuilder (Rails Default)
```ruby
# app/views/api/v1/articles/show.json.jbuilder
json.article do
  json.id @article.id
  json.title @article.title
  json.content @article.content
  
  json.author do
    json.id @article.author.id
    json.name @article.author.name
  end
  
  json.comments @article.comments do |comment|
    json.id comment.id
    json.body comment.body
  end
end

# Controller
def show
  @article = Article.find(params[:id])
  # Automatically renders show.json.jbuilder
end
```

### Custom Serialization
```ruby
class Article < ApplicationRecord
  def as_json(options = {})
    super(options.merge(
      only: [:id, :title, :content],
      include: {
        author: { only: [:id, :name] },
        comments: { only: [:id, :body] }
      },
      methods: [:comment_count]
    ))
  end
  
  def comment_count
    comments.count
  end
end
```

---

## Versioning

### URI Versioning (Most Common)
```ruby
# config/routes.rb
namespace :api do
  namespace :v1 do
    resources :articles
  end
  
  namespace :v2 do
    resources :articles
  end
end

# app/controllers/api/v1/articles_controller.rb
module Api
  module V1
    class ArticlesController < ApplicationController
      def index
        # V1 implementation
      end
    end
  end
end

# app/controllers/api/v2/articles_controller.rb
module Api
  module V2
    class ArticlesController < ApplicationController
      def index
        # V2 implementation with breaking changes
      end
    end
  end
end
```

### Header Versioning
```ruby
# config/routes.rb
constraints ApiVersion.new('v1') do
  namespace :api do
    resources :articles
  end
end

# lib/api_version.rb
class ApiVersion
  def initialize(version)
    @version = version
  end
  
  def matches?(request)
    request.headers['Accept'].include?("application/vnd.myapp.#{@version}+json")
  end
end
```

### Accept Header Versioning
```ruby
# Request header
Accept: application/vnd.myapp.v1+json

# Controller
class ApplicationController < ActionController::API
  before_action :set_api_version
  
  private
  
  def set_api_version
    @api_version = request.headers['Accept'].match(/v(\d+)/)[1]
  end
end
```

### Content Negotiation
```ruby
respond_to do |format|
  format.json { render json: @articles }
  format.xml { render xml: @articles }
end
```

---

## Authentication & Authorization

### Token-Based Authentication (JWT)
```ruby
# Gemfile
gem 'jwt'

# app/lib/json_web_token.rb
class JsonWebToken
  SECRET_KEY = Rails.application.credentials.secret_key_base
  
  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end
  
  def self.decode(token)
    body = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new(body)
  rescue JWT::DecodeError, JWT::ExpiredSignature
    nil
  end
end

# app/controllers/authentication_controller.rb
class AuthenticationController < ApplicationController
  skip_before_action :authenticate_request
  
  def login
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: { token: token, user: user }, status: :ok
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end
end

# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  before_action :authenticate_request
  
  attr_reader :current_user
  
  private
  
  def authenticate_request
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    
    decoded = JsonWebToken.decode(token)
    @current_user = User.find(decoded[:user_id]) if decoded
    
    render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end
end
```

### API Key Authentication
```ruby
# app/models/user.rb
class User < ApplicationRecord
  has_secure_token :api_key
  
  def regenerate_api_key
    regenerate_api_key
  end
end

# app/controllers/application_controller.rb
before_action :authenticate_with_api_key

private

def authenticate_with_api_key
  api_key = request.headers['X-API-KEY']
  @current_user = User.find_by(api_key: api_key)
  
  render json: { error: 'Invalid API key' }, status: :unauthorized unless @current_user
end
```

### OAuth 2.0 with Doorkeeper
```ruby
# Gemfile
gem 'doorkeeper'

# config/initializers/doorkeeper.rb
Doorkeeper.configure do
  orm :active_record
  
  resource_owner_authenticator do
    User.find_by(id: session[:user_id]) || redirect_to(login_url)
  end
  
  access_token_expires_in 2.hours
  refresh_token_enabled true
end

# app/controllers/api/v1/base_controller.rb
class Api::V1::BaseController < ApplicationController
  before_action :doorkeeper_authorize!
  
  private
  
  def current_user
    @current_user ||= User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
  end
end
```

### Pundit Authorization
```ruby
# Gemfile
gem 'pundit'

# app/policies/article_policy.rb
class ArticlePolicy < ApplicationPolicy
  def index?
    true
  end
  
  def show?
    true
  end
  
  def create?
    user.present?
  end
  
  def update?
    user.present? && record.author == user
  end
  
  def destroy?
    user.present? && (record.author == user || user.admin?)
  end
end

# app/controllers/api/v1/articles_controller.rb
class Api::V1::ArticlesController < ApplicationController
  include Pundit::Authorization
  
  def update
    article = Article.find(params[:id])
    authorize article
    
    if article.update(article_params)
      render json: article
    else
      render json: { errors: article.errors }, status: :unprocessable_entity
    end
  end
  
  rescue_from Pundit::NotAuthorizedError do
    render json: { error: 'Forbidden' }, status: :forbidden
  end
end
```

---

## Error Handling

### Centralized Error Handling
```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  rescue_from ActionController::ParameterMissing, with: :bad_request
  
  private
  
  def not_found(exception)
    render json: {
      error: 'Resource not found',
      message: exception.message
    }, status: :not_found
  end
  
  def unprocessable_entity(exception)
    render json: {
      error: 'Validation failed',
      details: exception.record.errors.full_messages
    }, status: :unprocessable_entity
  end
  
  def bad_request(exception)
    render json: {
      error: 'Bad request',
      message: exception.message
    }, status: :bad_request
  end
end
```

### Custom Error Responses
```ruby
# app/serializers/error_serializer.rb
class ErrorSerializer
  def initialize(errors)
    @errors = errors
  end
  
  def as_json
    {
      errors: @errors.map do |field, messages|
        {
          field: field,
          messages: messages
        }
      end
    }
  end
end

# Controller
def create
  article = Article.new(article_params)
  
  if article.save
    render json: article, status: :created
  else
    render json: ErrorSerializer.new(article.errors).as_json, 
           status: :unprocessable_entity
  end
end
```

### Standard Error Format (JSON:API)
```ruby
def render_error(status, title, detail = nil)
  render json: {
    errors: [
      {
        status: status.to_s,
        title: title,
        detail: detail
      }
    ]
  }, status: status
end

# Usage
render_error(:not_found, 'Article not found', "Article with id #{params[:id]} does not exist")
```

---

## CORS

### Rack CORS Configuration
```ruby
# Gemfile
gem 'rack-cors'

# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:3000', 'example.com'
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      max_age: 86400
  end
end
```

### Custom CORS for Specific Routes
```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'trusted-app.com'
    resource '/api/v1/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete],
      credentials: true
  end
  
  allow do
    origins '*'
    resource '/api/v1/public/*',
      headers: :any,
      methods: [:get],
      credentials: false
  end
end
```

### Preflight Requests
CORS preflight requests (OPTIONS) are handled automatically by Rack CORS. The browser sends an OPTIONS request before the actual request to check permissions.

---

## Rate Limiting & Throttling

### Rack Attack
```ruby
# Gemfile
gem 'rack-attack'

# config/initializers/rack_attack.rb
class Rack::Attack
  # Throttle all requests by IP (60 requests per minute)
  throttle('req/ip', limit: 60, period: 1.minute) do |req|
    req.ip
  end
  
  # Throttle API requests by API key
  throttle('api/key', limit: 1000, period: 1.hour) do |req|
    req.env['HTTP_X_API_KEY'] if req.path.start_with?('/api')
  end
  
  # Throttle login attempts
  throttle('login/email', limit: 5, period: 20.minutes) do |req|
    if req.path == '/api/v1/login' && req.post?
      req.params['email'].presence
    end
  end
  
  # Block suspicious requests
  blocklist('block suspicious requests') do |req|
    Rack::Attack::Fail2Ban.filter("suspicious-#{req.ip}", maxretry: 5, findtime: 1.minute, bantime: 10.minutes) do
      req.path.include?('admin') && !req.env['HTTP_X_API_KEY']
    end
  end
  
  # Custom response for throttled requests
  self.throttled_responder = lambda do |env|
    retry_after = (env['rack.attack.match_data'] || {})[:period]
    [
      429,
      {
        'Content-Type' => 'application/json',
        'Retry-After' => retry_after.to_s
      },
      [{ error: 'Rate limit exceeded', retry_after: retry_after }.to_json]
    ]
  end
end

# config/application.rb
config.middleware.use Rack::Attack
```

### Redis-Based Rate Limiting
```ruby
# app/controllers/concerns/rate_limitable.rb
module RateLimitable
  extend ActiveSupport::Concern
  
  included do
    before_action :check_rate_limit
  end
  
  private
  
  def check_rate_limit
    key = "rate_limit:#{request.ip}:#{controller_name}"
    count = REDIS.get(key).to_i
    
    if count >= 100
      render json: { error: 'Rate limit exceeded' }, status: :too_many_requests
      return
    end
    
    REDIS.multi do
      REDIS.incr(key)
      REDIS.expire(key, 1.hour)
    end
  end
end
```

---

## API Documentation

### Swagger/OpenAPI with Rswag
```ruby
# Gemfile
gem 'rswag'

# spec/swagger_helper.rb
RSpec.configure do |config|
  config.swagger_root = Rails.root.join('swagger').to_s
  
  config.swagger_docs = {
    'v1/swagger.yaml' => {
      openapi: '3.0.1',
      info: {
        title: 'API V1',
        version: 'v1'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearer_auth: {
            type: :http,
            scheme: :bearer,
            bearerFormat: 'JWT'
          }
        }
      }
    }
  }
end

# spec/requests/api/v1/articles_spec.rb
require 'swagger_helper'

RSpec.describe 'api/v1/articles', type: :request do
  path '/api/v1/articles' do
    get 'List articles' do
      tags 'Articles'
      produces 'application/json'
      security [bearer_auth: []]
      
      parameter name: :page, in: :query, type: :integer, required: false
      parameter name: :per_page, in: :query, type: :integer, required: false
      
      response '200', 'articles found' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :integer },
              title: { type: :string },
              content: { type: :string }
            }
          }
        
        run_test!
      end
      
      response '401', 'unauthorized' do
        run_test!
      end
    end
  end
end

# Generate documentation
rake rswag:specs:swaggerize
```

### API Blueprint
```markdown
# API Documentation

## Articles [/api/v1/articles]

### List All Articles [GET]

+ Response 200 (application/json)
    + Attributes (array[Article])

### Create Article [POST]

+ Request (application/json)
    + Attributes
        + title: My Article (string, required)
        + content: Article content (string, required)

+ Response 201 (application/json)
    + Attributes (Article)
```

### RDoc/YARD Comments
```ruby
# @!group Articles API

# Lists all articles
#
# @example Request
#   GET /api/v1/articles
#
# @example Response
#   Status: 200 OK
#   [
#     {
#       "id": 1,
#       "title": "My Article",
#       "content": "Content here"
#     }
#   ]
#
# @param [Integer] page Page number for pagination
# @param [Integer] per_page Number of items per page
# @return [Array<Article>] List of articles
def index
  # Implementation
end
```

---

## GraphQL (Bonus)

### Setup with graphql-ruby
```ruby
# Gemfile
gem 'graphql'

# Generate GraphQL setup
rails generate graphql:install

# app/graphql/types/article_type.rb
module Types
  class ArticleType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: false
    field :content, String, null: false
    field :published_at, GraphQL::Types::ISO8601DateTime, null: true
    
    field :author, Types::UserType, null: false
    field :comments, [Types::CommentType], null: false
    
    def author
      Loaders::RecordLoader.for(User).load(object.author_id)
    end
  end
end

# app/graphql/types/query_type.rb
module Types
  class QueryType < Types::BaseObject
    field :articles, [Types::ArticleType], null: false do
      argument :limit, Integer, required: false, default_value: 10
    end
    
    field :article, Types::ArticleType, null: true do
      argument :id, ID, required: true
    end
    
    def articles(limit:)
      Article.limit(limit)
    end
    
    def article(id:)
      Article.find(id)
    end
  end
end

# app/graphql/types/mutation_type.rb
module Types
  class MutationType < Types::BaseObject
    field :create_article, mutation: Mutations::CreateArticle
  end
end

# app/graphql/mutations/create_article.rb
module Mutations
  class CreateArticle < BaseMutation
    argument :title, String, required: true
    argument :content, String, required: true
    
    field :article, Types::ArticleType, null: true
    field :errors, [String], null: false
    
    def resolve(title:, content:)
      article = Article.new(title: title, content: content, author: context[:current_user])
      
      if article.save
        { article: article, errors: [] }
      else
        { article: nil, errors: article.errors.full_messages }
      end
    end
  end
end

# Query example
query {
  articles(limit: 5) {
    id
    title
    author {
      name
    }
  }
}

# Mutation example
mutation {
  createArticle(input: { title: "New Article", content: "Content here" }) {
    article {
      id
      title
    }
    errors
  }
}
```

---

## Common Interview Questions

### 1. **How do you handle API versioning and why is it important?**
Versioning prevents breaking changes for existing clients. URI versioning (`/api/v1/`) is most common and visible. Header versioning is cleaner but less discoverable. Always maintain backward compatibility within a version, create new versions for breaking changes.

### 2. **What's the difference between PUT and PATCH?**
PUT replaces the entire resource (requires all fields), PATCH partially updates specific fields. In Rails, both typically map to the update action, but semantically PATCH is preferred for partial updates.

### 3. **How do you implement pagination in APIs?**
```ruby
# Using kaminari or will_paginate
articles = Article.page(params[:page]).per(params[:per_page] || 20)

# Include pagination metadata in response
render json: articles, meta: {
  current_page: articles.current_page,
  total_pages: articles.total_pages,
  total_count: articles.total_count
}
```

### 4. **How do you handle N+1 queries in API responses?**
Use eager loading with `includes`, `preload`, or `eager_load`. Implement serializers that batch-load associations. Use tools like Bullet to detect N+1 queries during development.

### 5. **What status code should you return when a resource is successfully deleted?**
`204 No Content` is standard for successful DELETE requests with no response body. Some APIs return `200 OK` with a confirmation message.

### 6. **How would you implement search and filtering in an API?**
```ruby
def index
  articles = Article.all
  articles = articles.where(status: params[:status]) if params[:status]
  articles = articles.where('title LIKE ?', "%#{params[:q]}%") if params[:q]
  articles = articles.order(params[:sort] || 'created_at DESC')
  
  render json: articles
end
```

### 7. **How do you secure API endpoints?**
Implement authentication (JWT, OAuth, API keys), use HTTPS, validate inputs, implement rate limiting, use CORS properly, follow principle of least privilege, audit logs for sensitive operations.

### 8. **What's the difference between authentication and authorization?**
Authentication verifies who the user is (login, tokens). Authorization determines what they can do (permissions, roles, policies).

---

## Best Practices Summary

1. **Always use proper HTTP status codes** - 2xx for success, 4xx for client errors, 5xx for server errors
2. **Version your APIs** - Allows evolution without breaking existing clients
3. **Use serializers** - Separate presentation logic from models
4. **Implement proper error handling** - Consistent error format across the API
5. **Add rate limiting** - Protect against abuse and ensure fair usage
6. **Document your API** - Makes integration easier for consumers
7. **Use pagination** - Don't return unlimited records
8. **Implement authentication** - Secure your endpoints appropriately
9. **Enable CORS carefully** - Only allow trusted origins
10. **Test thoroughly** - Write request specs for all endpoints

---

## Resources
- [Rails API Documentation](https://guides.rubyonrails.org/api_app.html)
- [JSON:API Specification](https://jsonapi.org/)
- [REST API Best Practices](https://restfulapi.net/)
- [JWT.io](https://jwt.io/)
- [GraphQL Ruby](https://graphql-ruby.org/)



