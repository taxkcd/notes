# Ruby on Rails Interview Guide - Comprehensive Reference

## Table of Contents
1. [Ruby Fundamentals](#ruby-fundamentals)
2. [Rails Architecture & MVC](#rails-architecture--mvc)
3. [ActiveRecord & Database](#activerecord--database)
4. [API Development](#api-development)
5. [Authentication & Authorization](#authentication--authorization)
6. [Background Jobs & Scheduling](#background-jobs--scheduling)
7. [Testing (RSpec)](#testing-rspec)
8. [Performance & Optimization](#performance--optimization)
9. [Security Best Practices](#security-best-practices)
10. [Your Project-Specific Questions](#your-project-specific-questions)

---


## Ruby Fundamentals

### Q: Explain the difference between a class and a module in Ruby
**Answer:** 
- **Class**: Blueprint for objects, supports inheritance (single), can be instantiated
- **Module**: Collection of methods and constants, supports mixins, cannot be instantiated
- Use modules for namespacing and sharing behavior across unrelated classes

```ruby
module Loggable
  def log(message)
    puts "[LOG] #{message}"
  end
end

class User
  include Loggable  # Mixin
end
```

### Q: What are blocks, procs, and lambdas?
**Answer:**
- **Block**: Anonymous code chunk passed to methods (not objects)
- **Proc**: Block converted to object, flexible argument handling
- **Lambda**: Stricter proc, enforces argument count, returns to caller

```ruby
# Block
[1,2,3].each { |n| puts n }

# Proc
my_proc = Proc.new { |x| x * 2 }
my_proc.call(5)  # => 10

# Lambda
my_lambda = ->(x) { x * 2 }
my_lambda.call(5)  # => 10
```

**Key Difference**: Lambdas check argument count and return to the calling method; Procs don't.

### Q: Explain `self` in Ruby
**Answer:**
- `self` refers to the current object
- In class methods: refers to the class itself
- In instance methods: refers to the instance
- Important for defining class methods: `def self.method_name`

### Q: What is metaprogramming? Give examples
**Answer:**
Code that writes code. Common uses:
- `define_method`: Create methods dynamically
- `method_missing`: Handle undefined methods
- `send`: Call methods dynamically
- `class_eval` / `instance_eval`: Evaluate code in context

```ruby
class User
  [:name, :email].each do |attr|
    define_method(attr) { instance_variable_get("@#{attr}") }
    define_method("#{attr}=") { |val| instance_variable_set("@#{attr}", val) }
  end
end
```

---

## Rails Architecture & MVC

### Q: Explain the MVC pattern in Rails
**Answer:**
- **Model**: Business logic, data, validations (ActiveRecord)
- **View**: Presentation layer (ERB, HTML)
- **Controller**: Handles requests, coordinates model and view

**Request Flow**: Route → Controller → Model → Controller → View → Response

### Q: What is the Rails request-response cycle?
**Answer:**
1. Browser sends HTTP request
2. Rails router matches route to controller#action
3. Controller processes request (may interact with models)
4. Controller renders view or returns JSON
5. Response sent back to browser

### Q: Explain Rails naming conventions
**Answer:**
- **Model**: Singular, CamelCase (`User`, `OrderItem`)
- **Table**: Plural, snake_case (`users`, `order_items`)
- **Controller**: Plural, CamelCase + Controller (`UsersController`)
- **File names**: snake_case (`user.rb`, `users_controller.rb`)

### Q: What are concerns? When would you use them?
**Answer:**
Concerns extract reusable code into modules for models/controllers.

```ruby
# app/models/concerns/searchable.rb
module Searchable
  extend ActiveSupport::Concern
  
  included do
    scope :search, ->(query) { where("name LIKE ?", "%#{query}%") }
  end
  
  class_methods do
    def advanced_search(params)
      # Complex search logic
    end
  end
end

class Product < ApplicationRecord
  include Searchable
end
```

**Use when**: Sharing behavior across multiple models/controllers, avoiding fat models.

### Q: Difference between `render` and `redirect_to`?
**Answer:**
- **render**: Displays a view without new HTTP request, stays in same action
- **redirect_to**: Sends new HTTP request (302), triggers new controller action

```ruby
# Render (no new request)
render :edit  # Shows edit view, stays in current action

# Redirect (new request)
redirect_to users_path  # New GET request to index action
```

---

## ActiveRecord & Database

### Q: Explain N+1 queries and how to solve them
**Answer:**
**Problem**: Loading associations in a loop causes multiple queries

```ruby
# Bad (N+1)
users = User.all
users.each { |user| puts user.posts.count }  # N queries for posts

# Good (eager loading)
users = User.includes(:posts)
users.each { |user| puts user.posts.count }  # 2 queries total
```

**Solutions**:
- `includes`: Eager load (separate queries)
- `joins`: SQL JOIN (single query, no loading)
- `preload`: Force separate queries
- `eager_load`: Force LEFT OUTER JOIN

### Q: Difference between `find`, `find_by`, and `where`?
**Answer:**
```ruby
User.find(1)           # Raises exception if not found
User.find_by(email: 'test@test.com')  # Returns nil if not found
User.where(active: true)  # Returns ActiveRecord::Relation (chainable)
```

### Q: Explain database migrations
**Answer:**
Version control for database schema. Run sequentially by timestamp.

```ruby
class AddIndexToUsers < ActiveRecord::Migration[7.0]
  def change
    add_index :users, :email, unique: true
  end
end
```

**Best Practices**:
- Never edit old migrations after deployment
- Use `reversible` for complex migrations
- Always add indexes for foreign keys
- Use `change` method when possible (auto-reversible)

### Q: What are scopes? How are they different from class methods?
**Answer:**
**Scopes**: Chainable queries defined with `scope`

```ruby
class Article < ApplicationRecord
  scope :published, -> { where(published: true) }
  scope :recent, -> { order(created_at: :desc).limit(10) }
  
  # Equivalent class method
  def self.published
    where(published: true)
  end
end

Article.published.recent  # Chainable
```

**Difference**: Scopes always return a relation (even if nil), class methods can return anything.

### Q: Explain ActiveRecord callbacks and their order
**Answer:**
**Order**:
1. `before_validation`
2. `after_validation`
3. `before_save`
4. `before_create` (on new records)
5. `after_create` (on new records)
6. `after_save`
7. `after_commit`

```ruby
class User < ApplicationRecord
  before_save :normalize_email
  after_create :send_welcome_email
  
  private
  
  def normalize_email
    self.email = email.downcase.strip
  end
end
```

**Warning**: Avoid heavy logic in callbacks; use service objects instead.

### Q: What are polymorphic associations?
**Answer:**
A model belongs to multiple other models on a single association.

```ruby
class Comment < ApplicationRecord
  belongs_to :commentable, polymorphic: true
end

class Article < ApplicationRecord
  has_many :comments, as: :commentable
end

class Video < ApplicationRecord
  has_many :comments, as: :commentable
end

# Usage
article.comments.create(body: "Great!")
video.comments.create(body: "Nice!")
```

---

## API Development

### Q: How do you version APIs in Rails?
**Answer:**
**Namespace approach**:
```ruby
# config/routes.rb
namespace :api do
  namespace :v1 do
    resources :users
  end
  namespace :v2 do
    resources :users
  end
end

# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < ApplicationController
      def index
        render json: User.all
      end
    end
  end
end
```

### Q: Explain RESTful API design principles
**Answer:**
- Use HTTP verbs correctly (GET, POST, PUT/PATCH, DELETE)
- Resource-based URLs (`/api/v1/users`, not `/api/v1/get_users`)
- Proper status codes (200, 201, 204, 400, 401, 404, 500)
- Stateless (no session data)
- JSON responses with consistent structure

```ruby
# Good RESTful endpoints
GET    /api/v1/users          # List users
POST   /api/v1/users          # Create user
GET    /api/v1/users/:id      # Show user
PATCH  /api/v1/users/:id      # Update user
DELETE /api/v1/users/:id      # Delete user
```

### Q: How do you handle API authentication?
**Answer:**
**Token-based (JWT)**:
```ruby
# Generate token
def generate_token(user)
  JWT.encode({ user_id: user.id, exp: 24.hours.from_now.to_i }, Rails.application.secret_key_base)
end

# Verify token
def authenticate_request
  token = request.headers['Authorization']&.split(' ')&.last
  decoded = JWT.decode(token, Rails.application.secret_key_base)
  @current_user = User.find(decoded[0]['user_id'])
rescue
  render json: { error: 'Unauthorized' }, status: :unauthorized
end
```

**API Keys** (simpler):
```ruby
before_action :authenticate_api_key

def authenticate_api_key
  api_key = request.headers['X-API-Key']
  @current_user = User.find_by(api_key: api_key)
  render json: { error: 'Invalid API key' }, status: :unauthorized unless @current_user
end
```

### Q: How do you document APIs?
**Answer:**
Based on your CV (Swagger experience):

```ruby
# Using rswag or swagger-docs gem
# spec/requests/api/v1/users_spec.rb
path '/api/v1/users' do
  get 'Retrieves all users' do
    tags 'Users'
    produces 'application/json'
    
    response '200', 'users found' do
      schema type: :array,
        items: {
          type: :object,
          properties: {
            id: { type: :integer },
            email: { type: :string }
          }
        }
      run_test!
    end
  end
end
```

---

## Authentication & Authorization

### Q: Explain Devise and how you've used it
**Answer:**
Devise is a flexible authentication solution. Key modules:
- **Database Authenticatable**: Encrypted password
- **Registerable**: Sign up
- **Recoverable**: Password reset
- **Rememberable**: Remember me cookie
- **Trackable**: Sign-in tracking
- **Validatable**: Email/password validation

**Your experience** (from CV - 2FA implementation):
```ruby
# app/models/user.rb
class User < ApplicationRecord
  devise :two_factor_authenticatable,
         :two_factor_backupable,
         otp_secret_encryption_key: ENV['OTP_SECRET_KEY']
end

# Controller
def verify_otp
  if current_user.validate_and_consume_otp!(params[:otp])
    sign_in current_user
    redirect_to root_path
  else
    flash[:error] = "Invalid code"
    render :otp_verification
  end
end
```

### Q: What's the difference between authentication and authorization?
**Answer:**
- **Authentication**: Verifying identity ("Who are you?") - Login
- **Authorization**: Verifying permissions ("What can you do?") - Access control

### Q: How do you implement authorization?
**Answer:**
**Pundit** (policy-based):
```ruby
# app/policies/article_policy.rb
class ArticlePolicy < ApplicationPolicy
  def update?
    user.admin? || record.author == user
  end
end

# Controller
def update
  @article = Article.find(params[:id])
  authorize @article
  @article.update(article_params)
end
```

**CanCanCan** (ability-based):
```ruby
class Ability
  include CanCan::Ability
  
  def initialize(user)
    if user.admin?
      can :manage, :all
    else
      can :read, Article
      can :update, Article, author_id: user.id
    end
  end
end
```

---

## Background Jobs & Scheduling

### Q: Explain background jobs in Rails. What libraries have you used?
**Answer:**
Background jobs handle time-consuming tasks asynchronously.

**ActiveJob** (Rails wrapper):
```ruby
class EmailJob < ApplicationJob
  queue_as :default
  
  def perform(user_id)
    user = User.find(user_id)
    UserMailer.welcome_email(user).deliver_now
  end
end

# Enqueue
EmailJob.perform_later(user.id)
```

**Sidekiq** (most popular backend):
- Uses Redis
- Multithreaded
- Retries failed jobs
- Web UI for monitoring

**Your experience** (from CV - Cron jobs):
```ruby
# lib/tasks/sync_chargebee.rake
namespace :chargebee do
  desc "Sync usage data daily"
  task sync_usage: :environment do
    ChargebeeService.sync_daily_usage
  end
end

# Schedule with whenever gem
# config/schedule.rb
every 1.day, at: '2:00 am' do
  rake "chargebee:sync_usage"
end
```

### Q: How do you handle failed background jobs?
**Answer:**
- **Retries**: Configure max attempts (Sidekiq default: 25)
- **Error tracking**: Sentry, Rollbar
- **Dead letter queue**: Manual inspection
- **Idempotency**: Ensure jobs can run multiple times safely

```ruby
class ImportJob < ApplicationJob
  retry_on StandardError, wait: 5.seconds, attempts: 3
  discard_on ActiveRecord::RecordNotFound
  
  def perform(file_id)
    # Import logic
  end
end
```

---

## Testing (RSpec)

### Q: Explain your testing approach (you mentioned 100% coverage)
**Answer:**
**Test Pyramid**:
- **Unit tests** (models, services): Fast, isolated
- **Integration tests** (controllers, requests): API behavior
- **System tests** (feature specs): End-to-end

**Example from your work**:
```ruby
# spec/models/user_spec.rb
RSpec.describe User, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email) }
  end
  
  describe '#full_name' do
    it 'returns first and last name' do
      user = User.new(first_name: 'John', last_name: 'Doe')
      expect(user.full_name).to eq('John Doe')
    end
  end
end

# spec/requests/api/v1/users_spec.rb
RSpec.describe 'Api::V1::Users', type: :request do
  describe 'GET /api/v1/users' do
    it 'returns users' do
      create_list(:user, 3)
      get '/api/v1/users'
      
      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end
end
```

### Q: What's the difference between `let`, `let!`, and `before`?
**Answer:**
```ruby
# let: Lazy-loaded (only when called)
let(:user) { create(:user) }

# let!: Eager-loaded (created immediately)
let!(:user) { create(:user) }

# before: Runs before each test
before do
  @user = create(:user)
end
```

### Q: How do you test external API calls?
**Answer:**
**WebMock** or **VCR**:
```ruby
# spec/spec_helper.rb
require 'webmock/rspec'

# spec/services/weather_service_spec.rb
RSpec.describe WeatherService do
  it 'fetches weather data' do
    stub_request(:get, "https://api.weather.com/forecast")
      .to_return(status: 200, body: { temp: 72 }.to_json)
    
    result = WeatherService.fetch_forecast('London')
    expect(result[:temp]).to eq(72)
  end
end
```

---

## Performance & Optimization

### Q: How do you optimize slow queries?
**Answer:**
1. **Add indexes**: Foreign keys, frequently queried columns
```ruby
add_index :articles, :user_id
add_index :articles, [:published, :created_at]
```

2. **Use `select` to limit columns**:
```ruby
User.select(:id, :name)  # Instead of SELECT *
```

3. **Counter caches**:
```ruby
class Article < ApplicationRecord
  belongs_to :user, counter_cache: true
end
# Add users.articles_count column
```

4. **Database-level calculations**:
```ruby
Article.sum(:views)  # Database SUM
Article.pluck(:title)  # Returns array, skips instantiation
```

5. **Pagination**:
```ruby
# Use kaminari or pagy
Article.page(params[:page]).per(20)
```

### Q: What caching strategies do you know?
**Answer:**
**Fragment caching**:
```erb
<% cache @article do %>
  <%= render @article %>
<% end %>
```

**Russian Doll caching**:
```erb
<% cache @article do %>
  <%= @article.title %>
  <% cache @article.comments do %>
    <%= render @article.comments %>
  <% end %>
<% end %>
```

**Low-level caching**:
```ruby
Rails.cache.fetch("user_#{user.id}_stats", expires_in: 1.hour) do
  user.calculate_complex_stats
end
```

**HTTP caching**:
```ruby
def show
  @article = Article.find(params[:id])
  fresh_when(@article)  # Sets ETag and Last-Modified
end
```

---

## Security Best Practices

### Q: How do you prevent common security vulnerabilities?
**Answer:**

**SQL Injection**:
```ruby
# Bad
User.where("email = '#{params[:email]}'")

# Good
User.where(email: params[:email])
User.where("email = ?", params[:email])
```

**XSS (Cross-Site Scripting)**:
- Rails auto-escapes in views
- Use `sanitize` for user HTML
- Never use `html_safe` on user input

**CSRF (Cross-Site Request Forgery)**:
```ruby
# Rails includes this by default
protect_from_forgery with: :exception
```

**Mass Assignment**:
```ruby
# Use strong parameters
def user_params
  params.require(:user).permit(:name, :email)
end
```

**Your experience** (from CV - AWS S3 presigned URLs):
```ruby
def generate_presigned_url(file_key)
  s3 = Aws::S3::Resource.new
  obj = s3.bucket(ENV['S3_BUCKET']).object(file_key)
  obj.presigned_url(:get, expires_in: 3600)  # 1 hour expiry
end
```

### Q: How do you secure API endpoints?
**Answer:**
1. **Rate limiting** (rack-attack gem)
2. **HTTPS only**
3. **Token expiration**
4. **Input validation** (strong params)
5. **CORS configuration**:
```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://example.com'
    resource '/api/*', methods: [:get, :post], headers: :any
  end
end
```

---

## Your Project-Specific Questions

### Q: Explain the Chargebee integration you built
**Answer (based on your CV)**:
"I integrated Chargebee for subscription billing. We needed to sync usage data daily:
- Built a service to calculate daily usage metrics per customer
- Created scheduled Rake tasks via cron to run nightly
- Pushed data to Chargebee API using their Ruby SDK
- Implemented error handling and retry logic for failed syncs
- Added monitoring via custom logging for debugging production issues"

### Q: Tell me about migrating from Mandrill to Flowmailer with zero downtime
**Answer**:
"The migration required careful planning:
1. Set up Flowmailer in parallel (dual-write pattern)
2. Started sending emails via both services temporarily
3. Monitored delivery rates and error logs
4. Gradually shifted traffic from Mandrill to Flowmailer
5. Once confident, disabled Mandrill
6. Updated all email templates and configurations

Key was feature flags to toggle between providers and thorough testing in staging."

### Q: How did you implement the Email Branding feature?
**Answer**:
"Built a customization system allowing:
- Logo upload (Active Storage with S3)
- Color picker for brand colors (stored in user preferences)
- Custom header/footer templates (ERB with user variables)
- Preview functionality before saving
- Applied customizations via email template rendering

Used concerns to share branding logic across different mailers."

### Q: Explain your approach to achieving 100% test coverage
**Answer**:
"I followed TDD principles:
- Wrote tests before implementation
- Covered all model validations, associations, and methods
- Request specs for all API endpoints (success and failure cases)
- Used SimpleCov to track coverage metrics
- Required tests for all new PRs
- Focused on meaningful tests, not just coverage percentage"

### Q: How did you handle 40+ production issues?
**Answer**:
"Systematic debugging approach:
1. Reviewed error logs and stack traces
2. Reproduced issues in staging when possible
3. Wrote diagnostic scripts to investigate data state
4. Used Rails console on production (carefully) for investigation
5. Implemented fixes with tests
6. Enhanced logging for future diagnostics
7. Documented solutions in Confluence for team reference"

---

## Behavioral Questions (STAR Method)

### Q: Tell me about a challenging bug you solved
**Template**: Situation → Task → Action → Result

**Example**: 
"In the Chargebee integration, we had intermittent sync failures. I investigated logs, found timeout issues with large data batches. I refactored to batch process in smaller chunks and added exponential backoff retry logic. Sync reliability improved from 85% to 99.5%."

### Q: How do you prioritize technical debt vs new features?
**Answer**: "Balance short-term delivery with long-term maintainability. I advocate for dedicating 20% of sprint capacity to refactoring. If technical debt blocks new features or causes bugs, it becomes higher priority."

### Q: Describe your code review process
**Answer**: "I check for:
- Correct functionality and edge cases
- Test coverage
- Security vulnerabilities
- Performance implications
- Code readability and Rails conventions
- Provide constructive feedback with examples"

---

## Rapid-Fire Technical Questions

**Q: What's the difference between `include` and `extend`?**
A: `include` adds module methods as instance methods. `extend` adds them as class methods.

**Q: What is `yield` in Ruby?**
A: Calls a block passed to a method.

**Q: Difference between `String` and `Symbol`?**
A: Symbols are immutable, unique in memory, used for keys/identifiers.

**Q: What is a service object?**
A: Plain Ruby class that encapsulates business logic, keeping models/controllers thin.

**Q: What's the difference between `save` and `save!`?**
A: `save` returns true/false. `save!` raises exception on validation failure.

**Q: How do you rollback a migration?**
A: `rails db:rollback` or `rails db:rollback STEP=3`

**Q: What is eager loading?**
A: Loading associated records in advance to avoid N+1 queries.

**Q: Explain RESTful routing**
A: Standard CRUD routes: index, show, new, create, edit, update, destroy.

---

## Interview Day Tips

1. **Clarify questions**: Ask for examples if unclear
2. **Think aloud**: Explain your reasoning
3. **Start simple**: Basic solution first, then optimize
4. **Mention trade-offs**: "This approach is faster but uses more memory"
5. **Use your experience**: Reference your CV projects naturally
6. **Ask questions**: Show interest in their tech stack and challenges

## Good Questions to Ask the Interviewer

- What's your deployment process?
- How do you handle database migrations in production?
- What monitoring/error tracking tools do you use?
- What's the test coverage on the codebase?
- How large is the engineering team?
- What's your approach to technical debt?
- What does a typical sprint look like?

---

**Good luck with your