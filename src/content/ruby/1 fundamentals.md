



## Rails Fundamentals

### MVC Architecture

**Model-View-Controller pattern in Rails:**
- **Models**: Business logic, database interactions (Active Record)
- **Views**: Presentation layer (ERB, Haml, Slim)
- **Controllers**: Handle requests, coordinate between models and views

**Request lifecycle:**
1. Router matches URL to controller action
2. Controller processes request, interacts with models
3. Controller renders view or returns JSON
4. Response sent to client

### Convention Over Configuration

**Key conventions:**
- File naming: `User` model → `user.rb`, `UsersController` → `users_controller.rb`
- Database tables: pluralized model names (`users` table for `User` model)
- Primary keys: `id` by default
- Foreign keys: `user_id` for `belongs_to :user`
- Table joins: alphabetically ordered `comments_posts` for many-to-many

### Rails Directory Structure

```
app/               # Application code
  controllers/     # Request handlers
  models/          # Business logic & data
  views/           # Templates
  helpers/         # View helpers
  mailers/         # Email logic
  jobs/            # Background jobs
  channels/        # ActionCable channels
config/            # Configuration files
  routes.rb        # URL routing
  database.yml     # Database config
db/                # Database related
  migrate/         # Migration files
  schema.rb        # Database schema
lib/               # Custom libraries
public/            # Static files
test/ or spec/     # Tests
```

---

## Active Record & Database

### Associations

**Types of associations:**

```ruby
# One-to-Many
class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :nullify
end

class Post < ApplicationRecord
  belongs_to :user
  has_many :comments
end

# Many-to-Many (has_and_belongs_to_many)
class User < ApplicationRecord
  has_and_belongs_to_many :roles
end

# Many-to-Many (has_many through) - Preferred for join table attributes
class User < ApplicationRecord
  has_many :memberships
  has_many :teams, through: :memberships
end

class Membership < ApplicationRecord
  belongs_to :user
  belongs_to :team
end

# Polymorphic
class Comment < ApplicationRecord
  belongs_to :commentable, polymorphic: true
end

class Post < ApplicationRecord
  has_many :comments, as: :commentable
end

class Video < ApplicationRecord
  has_many :comments, as: :commentable
end

# Self-referential
class User < ApplicationRecord
  has_many :friendships
  has_many :friends, through: :friendships
end
```

**Association options:**
- `dependent: :destroy` - Delete associated records
- `dependent: :delete_all` - Delete without callbacks (faster)
- `dependent: :nullify` - Set foreign key to NULL
- `optional: true` - Allow nil association
- `inverse_of` - Specify inverse association for memory optimization
- `counter_cache` - Cache count of associations

### Querying

**Basic queries:**

```ruby
# Finding records
User.find(1)                    # Find by ID
User.find_by(email: 'user@example.com')
User.where(active: true)
User.where("created_at > ?", 1.week.ago)

# Chaining queries
User.where(active: true).order(created_at: :desc).limit(10)

# Select specific columns
User.select(:id, :email)

# Joins
User.joins(:posts).where(posts: { published: true })
User.left_joins(:posts) # LEFT OUTER JOIN

# Includes (eager loading - prevents N+1)
User.includes(:posts).where(posts: { published: true })
User.includes(:posts, :comments)

# Preload vs Eager Load
User.preload(:posts)  # Separate queries
User.eager_load(:posts)  # LEFT OUTER JOIN

# Aggregations
User.count
User.average(:age)
User.maximum(:created_at)
User.group(:country).count

# Scopes
class User < ApplicationRecord
  scope :active, -> { where(active: true) }
  scope :recent, -> { where("created_at > ?", 1.week.ago) }
  scope :by_name, ->(name) { where("name LIKE ?", "%#{name}%") }
end

User.active.recent
```

**N+1 Query Problem:**

```ruby
# Bad - N+1 queries
users = User.all
users.each do |user|
  puts user.posts.count  # Separate query for each user
end

# Good - Eager loading
users = User.includes(:posts)
users.each do |user|
  puts user.posts.count  # No additional queries
end
```

**Raw SQL & Query Performance:**

```ruby
# Raw SQL
User.find_by_sql("SELECT * FROM users WHERE email = 'user@example.com'")
ActiveRecord::Base.connection.execute("DELETE FROM old_records WHERE created_at < '2020-01-01'")

# Explain queries
User.where(email: 'user@example.com').explain

# Pluck for specific columns (returns array, not AR objects)
User.pluck(:email)  # Faster than User.select(:email).map(&:email)

# Find in batches (memory efficient)
User.find_each(batch_size: 1000) do |user|
  # Process user
end
```

### Validations

```ruby
class User < ApplicationRecord
  # Presence
  validates :email, :name, presence: true
  
  # Uniqueness
  validates :email, uniqueness: { case_sensitive: false }
  validates :username, uniqueness: { scope: :account_id }
  
  # Format
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  
  # Length
  validates :password, length: { minimum: 8, maximum: 128 }
  validates :bio, length: { maximum: 500 }
  
  # Numericality
  validates :age, numericality: { greater_than: 0, less_than: 150 }
  
  # Inclusion/Exclusion
  validates :status, inclusion: { in: %w[active inactive banned] }
  
  # Custom validations
  validate :password_complexity
  
  # Conditional validations
  validates :billing_address, presence: true, if: :paid_membership?
  validates :password, presence: true, on: :create
  
  private
  
  def password_complexity
    return if password.blank? || password =~ /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    errors.add :password, 'must include uppercase, lowercase, and digit'
  end
  
  def paid_membership?
    membership_type == 'paid'
  end
end

# Skip validations (use carefully)
user.save(validate: false)
user.update_attribute(:email, 'new@example.com')
```

### Callbacks

```ruby
class User < ApplicationRecord
  # Lifecycle callbacks
  before_validation :normalize_email
  after_validation :log_errors
  
  before_save :encrypt_password
  after_save :send_welcome_email
  
  before_create :generate_token
  after_create :notify_admin
  
  before_update :track_changes
  after_update :invalidate_cache
  
  before_destroy :cleanup_associations
  after_destroy :log_deletion
  
  after_commit :sync_to_search_index
  after_rollback :handle_failure
  
  # Conditional callbacks
  before_save :normalize_phone, if: :phone_changed?
  
  private
  
  def normalize_email
    self.email = email.downcase.strip if email.present?
  end
end

# Callback classes
class User < ApplicationRecord
  before_create EmailNormalizer
end

class EmailNormalizer
  def self.before_create(user)
    user.email = user.email.downcase.strip
  end
end
```

**Callback best practices:**
- Avoid complex business logic in callbacks
- Use service objects for complex operations
- Be cautious with `after_commit` - it runs after transaction
- Skip callbacks when needed: `user.update_columns(name: 'John')`

### Migrations

```ruby
# Generate migration
rails generate migration AddIndexToUsersEmail
rails generate migration CreateProducts name:string price:decimal

# Migration examples
class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :name
      t.integer :age
      t.boolean :active, default: true
      t.timestamps
    end
    
    add_index :users, :email, unique: true
  end
end

# Add/remove columns
class AddPhoneToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :phone, :string
    add_column :users, :verified, :boolean, default: false
  end
end

# Change column
class ChangeUsersEmailType < ActiveRecord::Migration[7.0]
  def up
    change_column :users, :email, :text
  end
  
  def down
    change_column :users, :email, :string
  end
end

# Add foreign key
class AddUserRefToPosts < ActiveRecord::Migration[7.0]
  def change
    add_reference :posts, :user, foreign_key: true, index: true
  end
end

# Reversible migration
class ChangeDataFormat < ActiveRecord::Migration[7.0]
  def up
    # Complex data transformation
    User.where(status: 0).update_all(status: 'inactive')
  end
  
  def down
    User.where(status: 'inactive').update_all(status: 0)
  end
end

# Data migration
class PopulateUserRoles < ActiveRecord::Migration[7.0]
  def up
    User.find_each do |user|
      user.update(role: 'member') if user.role.nil?
    end
  end
  
  def down
    # Optional rollback
  end
end
```

**Migration best practices:**
- Never modify old migrations in production
- Use `change` method when possible (automatically reversible)
- Add indexes for foreign keys and frequently queried columns
- Use `bulk: true` for multiple index additions
- Test migrations on production-like data volumes

### Database Indexing

```ruby
# Single column index
add_index :users, :email, unique: true

# Multi-column index (order matters)
add_index :posts, [:user_id, :created_at]

# Partial index (PostgreSQL)
add_index :orders, :user_id, where: "status = 'pending'"

# Expression index (PostgreSQL)
add_index :users, "lower(email)", name: 'index_users_on_lower_email'

# Concurrent index (PostgreSQL - doesn't lock table)
add_index :users, :email, algorithm: :concurrently
```

**When to add indexes:**
- Foreign keys
- Columns in WHERE clauses
- Columns in ORDER BY clauses
- Columns in JOIN conditions
- Unique constraints

**Index downsides:**
- Slower writes (INSERT, UPDATE, DELETE)
- Increased storage
- Don't over-index small tables

---

## Controllers & Routing

### RESTful Controllers

```ruby
class PostsController < ApplicationController
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :authenticate_user!, except: [:index, :show]
  
  # GET /posts
  def index
    @posts = Post.includes(:user).page(params[:page])
  end
  
  # GET /posts/:id
  def show
  end
  
  # GET /posts/new
  def new
    @post = Post.new
  end
  
  # POST /posts
  def create
    @post = current_user.posts.build(post_params)
    
    if @post.save
      redirect_to @post, notice: 'Post created successfully'
    else
      render :new, status: :unprocessable_entity
    end
  end
  
  # GET /posts/:id/edit
  def edit
  end
  
  # PATCH/PUT /posts/:id
  def update
    if @post.update(post_params)
      redirect_to @post, notice: 'Post updated successfully'
    else
      render :edit, status: :unprocessable_entity
    end
  end
  
  # DELETE /posts/:id
  def destroy
    @post.destroy
    redirect_to posts_url, notice: 'Post deleted successfully'
  end
  
  private
  
  def set_post
    @post = Post.find(params[:id])
  end
  
  def post_params
    params.require(:post).permit(:title, :body, :published)
  end
end
```

### Strong Parameters

```ruby
# Basic
params.require(:user).permit(:name, :email)

# Nested attributes
params.require(:user).permit(:name, :email, address_attributes: [:street, :city])

# Arrays
params.require(:post).permit(:title, tag_ids: [])

# Nested arrays and hashes
params.require(:user).permit(:name, posts_attributes: [:id, :title, :_destroy, tags: []])

# Custom method
def user_params
  permitted = [:name, :email]
  permitted << :admin if current_user.admin?
  params.require(:user).permit(permitted)
end
```

### Routing

```ruby
Rails.application.routes.draw do
  # RESTful resources
  resources :posts
  
  # Nested resources
  resources :posts do
    resources :comments, only: [:create, :destroy]
  end
  
  # Shallow nesting (better for deeply nested resources)
  resources :posts do
    resources :comments, shallow: true
  end
  # Generates: /posts/:post_id/comments (create)
  #            /comments/:id (show, edit, update, destroy)
  
  # Member and collection routes
  resources :posts do
    member do
      post :publish
      put :unpublish
    end
    
    collection do
      get :archived
    end
  end
  # /posts/:id/publish
  # /posts/archived
  
  # Custom routes
  get '/about', to: 'pages#about'
  post '/search', to: 'search#create'
  
  # Root route
  root 'home#index'
  
  # Namespace
  namespace :admin do
    resources :users
  end
  # /admin/users -> Admin::UsersController
  
  # Scope
  scope module: 'admin' do
    resources :users
  end
  # /users -> Admin::UsersController
  
  # Constraints
  constraints subdomain: 'api' do
    namespace :api do
      resources :posts
    end
  end
  
  # Direct routes
  direct :homepage do
    "https://example.com"
  end
  
  # Concerns (DRY routes)
  concern :commentable do
    resources :comments
  end
  
  resources :posts, concerns: :commentable
  resources :videos, concerns: :commentable
end
```

### Filters (Before/After/Around Actions)

```ruby
class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :set_locale
  after_action :log_request
  around_action :measure_performance
  
  private
  
  def authenticate_user!
    redirect_to login_path unless current_user
  end
  
  def set_locale
    I18n.locale = params[:locale] || I18n.default_locale
  end
  
  def log_request
    Rails.logger.info "Request completed: #{request.path}"
  end
  
  def measure_performance
    start = Time.current
    yield
    duration = Time.current - start
    Rails.logger.info "Action took #{duration}s"
  end
end

# Skip filters
class PublicController < ApplicationController
  skip_before_action :authenticate_user!
end
```

---

## Views & Assets

### ERB Templates

```erb
<%# Comments %>

<% # Ruby code (doesn't output) %>
<% @posts.each do |post| %>
  <%= # Outputs escaped HTML %>
  <%= post.title %>
  
  <%== # Outputs unescaped HTML (dangerous) %>
  <%== post.html_content %>
  
  <%= # Safe output with html_safe %>
  <%= post.html_content.html_safe %>
<% end %>

<%# Conditionals %>
<% if user_signed_in? %>
  <p>Welcome, <%= current_user.name %></p>
<% else %>
  <p>Please sign in</p>
<% end %>

<%# Links and paths %>
<%= link_to 'View Post', post_path(@post) %>
<%= link_to 'Edit', edit_post_path(@post), class: 'btn' %>
<%= link_to 'Delete', @post, method: :delete, data: { confirm: 'Are you sure?' } %>

<%# Forms %>
<%= form_with model: @post do |f| %>
  <%= f.label :title %>
  <%= f.text_field :title, class: 'form-control' %>
  
  <%= f.label :body %>
  <%= f.text_area :body, rows: 10 %>
  
  <%= f.submit 'Save' %>
<% end %>
```

### Helpers

```ruby
# app/helpers/application_helper.rb
module ApplicationHelper
  def format_date(date)
    date.strftime("%B %d, %Y") if date
  end
  
  def active_link(path)
    'active' if current_page?(path)
  end
  
  def truncate_html(text, length = 100)
    truncate(strip_tags(text), length: length)
  end
end

# Usage in views
<%= format_date(@post.created_at) %>
<li class="<%= active_link(posts_path) %>">Posts</li>
```

### Partials

```erb
<%# Render partial %>
<%= render 'shared/header' %>
<%= render partial: 'post', locals: { post: @post } %>

<%# Collection rendering %>
<%= render @posts %>
<%# Renders _post.html.erb for each post %>

<%= render partial: 'post', collection: @posts, as: :item %>

<%# With layout %>
<%= render partial: 'post', layout: 'post_wrapper' %>

<%# Caching partials %>
<% cache @post do %>
  <%= render @post %>
<% end %>
```

### Asset Pipeline

```ruby
# app/assets/stylesheets/application.css
/*
 *= require_tree .
 *= require_self
 */

# app/assets/javascripts/application.js
//= require rails-ujs
//= require turbolinks
//= require_tree .

# Image tags
<%= image_tag 'logo.png', alt: 'Logo', class: 'logo' %>
<%= image_tag @user.avatar.url, alt: @user.name %>

# Asset paths
<%= stylesheet_link_tag 'application' %>
<%= javascript_include_tag 'application' %>
```



