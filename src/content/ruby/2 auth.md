# Ruby on Rails - Authentication & Authorization

A comprehensive guide for understanding authentication and authorization in Rails applications.

## Table of Contents
1. [Authentication vs Authorization](#authentication-vs-authorization)
2. [Devise](#devise)
3. [Two-Factor Authentication (2FA)](#two-factor-authentication-2fa)
4. [OAuth Integration](#oauth-integration)
5. [Session Management](#session-management)
6. [JWT Authentication](#jwt-authentication)
7. [Authorization Patterns](#authorization-patterns)
8. [Pundit](#pundit)
9. [CanCanCan](#cancancan)
10. [Security Best Practices](#security-best-practices)
11. [Common Interview Questions](#common-interview-questions)

---

## Authentication vs Authorization

### Authentication
**"Who are you?"** - Verifying the identity of a user

Examples:
- Email/password login
- OAuth (Google, GitHub)
- Two-factor authentication
- Biometric verification

### Authorization
**"What can you do?"** - Determining what an authenticated user can access

Examples:
- Role-based access control (admin, user, guest)
- Resource-based permissions (can edit own posts)
- Feature flags
- Subscription-based access

---

## Devise

Devise is the most popular authentication solution for Rails. It's a flexible, modular engine that handles user authentication.

### Setup

```ruby
# Gemfile
gem 'devise'

# Installation
rails generate devise:install
rails generate devise User
rails db:migrate
```

### Configuration

```ruby
# config/initializers/devise.rb
Devise.setup do |config|
  # Secret key for session tokens
  config.secret_key = Rails.application.credentials.secret_key_base
  
  # Email sender
  config.mailer_sender = 'noreply@example.com'
  
  # Password requirements
  config.password_length = 8..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/
  
  # Session timeout
  config.timeout_in = 30.minutes
  
  # Remember me
  config.remember_for = 2.weeks
  config.expire_all_remember_me_on_sign_out = true
  
  # Lock strategy
  config.lock_strategy = :failed_attempts
  config.unlock_strategy = :both # email and time
  config.maximum_attempts = 5
  config.unlock_in = 1.hour
  
  # Sign out behavior
  config.sign_out_via = :delete
end
```

### Devise Modules

```ruby
# app/models/user.rb
class User < ApplicationRecord
  devise :database_authenticatable,     # Password authentication
         :registerable,                  # Sign up
         :recoverable,                   # Password reset
         :rememberable,                  # Remember me cookie
         :trackable,                     # Track sign in count, timestamps, IP
         :validatable,                   # Email and password validation
         :confirmable,                   # Email confirmation
         :lockable,                      # Lock account after failed attempts
         :timeoutable,                   # Session timeout
         :omniauthable                   # OAuth integration
end
```

### Custom User Model

```ruby
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Virtual attribute for authentication
  attr_accessor :login

  # Custom validations
  validates :username, presence: true, uniqueness: { case_sensitive: false }
  
  # Override Devise method to allow login with email or username
  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    if (login = conditions.delete(:login))
      where(conditions.to_h).where(
        ["lower(username) = :value OR lower(email) = :value", 
         { value: login.downcase }]
      ).first
    elsif conditions.has_key?(:username) || conditions.has_key?(:email)
      where(conditions.to_h).first
    end
  end
end
```

### Controllers

```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :first_name, :last_name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:username, :first_name, :last_name])
  end
end
```

### Custom Controllers

```ruby
# app/controllers/users/registrations_controller.rb
class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]

  # Override create to add custom logic
  def create
    build_resource(sign_up_params)

    if verify_recaptcha(model: resource) && resource.save
      yield resource if block_given?
      if resource.persisted?
        # Custom welcome email
        WelcomeEmailJob.perform_later(resource.id)
        
        if resource.active_for_authentication?
          sign_up(resource_name, resource)
          respond_with resource, location: after_sign_up_path_for(resource)
        else
          expire_data_after_sign_in!
          respond_with resource, location: after_inactive_sign_up_path_for(resource)
        end
      else
        clean_up_passwords resource
        set_minimum_password_length
        respond_with resource
      end
    else
      clean_up_passwords resource
      respond_with resource
    end
  end

  protected

  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :terms_of_service])
  end

  def after_sign_up_path_for(resource)
    onboarding_path
  end
end

# config/routes.rb
devise_for :users, controllers: {
  registrations: 'users/registrations',
  sessions: 'users/sessions',
  passwords: 'users/passwords'
}
```

### Custom Views

```bash
# Generate Devise views
rails generate devise:views

# Generate views for specific model
rails generate devise:views users
```

```erb
<!-- app/views/devise/sessions/new.html.erb -->
<h2>Log in</h2>

<%= form_for(resource, as: resource_name, url: session_path(resource_name)) do |f| %>
  <div class="field">
    <%= f.label :email %><br />
    <%= f.email_field :email, autofocus: true, autocomplete: "email" %>
  </div>

  <div class="field">
    <%= f.label :password %><br />
    <%= f.password_field :password, autocomplete: "current-password" %>
  </div>

  <% if devise_mapping.rememberable? %>
    <div class="field">
      <%= f.check_box :remember_me %>
      <%= f.label :remember_me %>
    </div>
  <% end %>

  <div class="actions">
    <%= f.submit "Log in" %>
  </div>
<% end %>

<%= render "devise/shared/links" %>
```

### Helper Methods

```ruby
# Check if user is signed in
user_signed_in?

# Current user
current_user

# Sign in/out
sign_in(@user)
sign_out(current_user)

# Authentication
authenticate_user!

# Access request object
user_session

# Check specific scope
admin_signed_in?
current_admin
authenticate_admin!
```

### Testing with Devise

```ruby
# spec/rails_helper.rb
RSpec.configure do |config|
  config.include Devise::Test::ControllerHelpers, type: :controller
  config.include Devise::Test::IntegrationHelpers, type: :request
end

# Controller specs
RSpec.describe PostsController, type: :controller do
  let(:user) { create(:user) }
  
  before { sign_in user }
  
  describe "GET #index" do
    it "returns success" do
      get :index
      expect(response).to be_successful
    end
  end
end

# Request specs
RSpec.describe "Posts", type: :request do
  let(:user) { create(:user) }
  
  before { sign_in user }
  
  describe "GET /posts" do
    it "returns success" do
      get posts_path
      expect(response).to be_successful
    end
  end
end
```

---

## Two-Factor Authentication (2FA)

### Using devise-two-factor

```ruby
# Gemfile
gem 'devise'
gem 'devise-two-factor'
gem 'rqrcode'

# Generate migration
rails generate devise_two_factor User ENCRYPTION_KEY

# app/models/user.rb
class User < ApplicationRecord
  devise :two_factor_authenticatable,
         :database_authenticatable, 
         :registerable,
         otp_secret_encryption_key: ENV['ENCRYPTION_KEY']
         
  has_one_time_password(encrypted: true)
end
```

### Implementation

```ruby
# app/controllers/users/two_factor_authentication_controller.rb
class Users::TwoFactorAuthenticationController < Devise::SessionsController
  def show
    unless session[:otp_user_id]
      redirect_to new_user_session_path
      return
    end
    
    @user = User.find(session[:otp_user_id])
  end

  def update
    @user = User.find(session[:otp_user_id])
    
    if @user.validate_and_consume_otp!(params[:otp_attempt])
      session.delete(:otp_user_id)
      sign_in(@user)
      redirect_to root_path, notice: "Successfully authenticated"
    else
      flash.now[:alert] = "Invalid authentication code"
      render :show
    end
  end
end

# Custom sessions controller
class Users::SessionsController < Devise::SessionsController
  def create
    self.resource = warden.authenticate(auth_options)
    
    if resource && resource.otp_required_for_login?
      session[:otp_user_id] = resource.id
      redirect_to users_two_factor_authentication_path
    else
      super
    end
  end
end
```

### Setup 2FA Flow

```ruby
# app/controllers/users/two_factor_settings_controller.rb
class Users::TwoFactorSettingsController < ApplicationController
  before_action :authenticate_user!

  def show
    if current_user.otp_required_for_login?
      @qr_code = nil
    else
      current_user.otp_secret = User.generate_otp_secret
      current_user.save!
      
      # Generate QR code
      qr_code_url = current_user.otp_provisioning_uri(
        current_user.email,
        issuer: 'YourApp'
      )
      
      @qr_code = RQRCode::QRCode.new(qr_code_url)
    end
  end

  def create
    if current_user.validate_and_consume_otp!(params[:otp_attempt])
      current_user.update!(otp_required_for_login: true)
      
      # Generate backup codes
      @backup_codes = generate_backup_codes
      
      flash[:notice] = "Two-factor authentication enabled"
      render :backup_codes
    else
      flash[:alert] = "Invalid verification code"
      redirect_to two_factor_settings_path
    end
  end

  def destroy
    current_user.update!(
      otp_required_for_login: false,
      otp_secret: nil
    )
    redirect_to profile_path, notice: "Two-factor authentication disabled"
  end

  private

  def generate_backup_codes
    codes = 10.times.map { SecureRandom.hex(4) }
    current_user.update!(backup_codes: codes)
    codes
  end
end
```

### Backup Codes

```ruby
# Migration
class AddBackupCodesToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :backup_codes, :text, array: true, default: []
  end
end

# app/models/user.rb
class User < ApplicationRecord
  # Validate backup code
  def validate_backup_code(code)
    return false unless backup_codes.include?(code)
    
    # Remove used code
    self.backup_codes = backup_codes - [code]
    save!
    true
  end
end

# In authentication controller
def update
  @user = User.find(session[:otp_user_id])
  
  # Try OTP first
  if @user.validate_and_consume_otp!(params[:otp_attempt])
    authenticate_user
  # Try backup code
  elsif params[:backup_code].present? && @user.validate_backup_code(params[:backup_code])
    authenticate_user
    flash[:warning] = "You used a backup code. Please regenerate your codes."
  else
    flash.now[:alert] = "Invalid code"
    render :show
  end
end
```

### SMS-Based 2FA

```ruby
# Using Twilio
# Gemfile
gem 'twilio-ruby'

# app/services/sms_service.rb
class SmsService
  def initialize
    @client = Twilio::REST::Client.new(
      ENV['TWILIO_ACCOUNT_SID'],
      ENV['TWILIO_AUTH_TOKEN']
    )
  end
  
  def send_otp(phone_number, code)
    @client.messages.create(
      from: ENV['TWILIO_PHONE_NUMBER'],
      to: phone_number,
      body: "Your verification code is: #{code}"
    )
  end
end

# app/models/user.rb
class User < ApplicationRecord
  def generate_sms_otp
    code = rand(100000..999999).to_s
    self.otp_code = code
    self.otp_expires_at = 5.minutes.from_now
    save!
    
    SmsService.new.send_otp(phone_number, code)
  end
  
  def verify_sms_otp(code)
    return false if otp_expires_at < Time.current
    return false unless otp_code == code
    
    self.otp_code = nil
    self.otp_expires_at = nil
    save!
    true
  end
end
```

---

## OAuth Integration

### Devise + OmniAuth Setup

```ruby
# Gemfile
gem 'omniauth'
gem 'omniauth-google-oauth2'
gem 'omniauth-github'
gem 'omniauth-facebook'
gem 'omniauth-microsoft_office365'
gem 'omniauth-rails_csrf_protection' # Important for security

# config/initializers/devise.rb
Devise.setup do |config|
  config.omniauth :google_oauth2, 
                  ENV['GOOGLE_CLIENT_ID'],
                  ENV['GOOGLE_CLIENT_SECRET'],
                  {
                    scope: 'email,profile',
                    prompt: 'select_account',
                    image_aspect_ratio: 'square',
                    image_size: 50
                  }
  
  config.omniauth :github,
                  ENV['GITHUB_CLIENT_ID'],
                  ENV['GITHUB_CLIENT_SECRET'],
                  scope: 'user:email'
                  
  config.omniauth :microsoft_office365,
                  ENV['MICROSOFT_CLIENT_ID'],
                  ENV['MICROSOFT_CLIENT_SECRET']
end
```

### Database Schema

```ruby
# Migration
class AddOmniauthToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :provider, :string
    add_column :users, :uid, :string
    add_column :users, :name, :string
    add_column :users, :avatar_url, :string
    add_column :users, :oauth_token, :string
    add_column :users, :oauth_expires_at, :datetime
    
    add_index :users, [:provider, :uid], unique: true
  end
end
```

### User Model

```ruby
# app/models/user.rb
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2, :github, :microsoft_office365]

  # Allow users without password (OAuth only)
  def password_required?
    super && provider.blank?
  end

  def email_required?
    super && provider.blank?
  end

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.name = auth.info.name
      user.avatar_url = auth.info.image
      
      # OAuth token for API calls
      user.oauth_token = auth.credentials.token
      user.oauth_expires_at = Time.at(auth.credentials.expires_at) if auth.credentials.expires_at
      
      # Skip confirmation if using confirmable
      user.skip_confirmation! if user.respond_to?(:skip_confirmation!)
    end
  end
end
```

### OmniAuth Callbacks Controller

```ruby
# app/controllers/users/omniauth_callbacks_controller.rb
class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  skip_before_action :verify_authenticity_token, only: [:google_oauth2, :github, :microsoft_office365]

  def google_oauth2
    handle_auth "Google"
  end

  def github
    handle_auth "Github"
  end

  def microsoft_office365
    handle_auth "Microsoft"
  end

  def failure
    redirect_to root_path, alert: "Authentication failed: #{params[:message]}"
  end

  private

  def handle_auth(kind)
    @user = User.from_omniauth(auth)

    if @user.persisted?
      sign_in_and_redirect @user, event: :authentication
      set_flash_message(:notice, :success, kind: kind) if is_navigational_format?
    else
      session["devise.#{kind.downcase}_data"] = auth.except(:extra)
      redirect_to new_user_registration_url, alert: @user.errors.full_messages.join("\n")
    end
  end

  def auth
    @auth ||= request.env['omniauth.auth']
  end
end

# config/routes.rb
devise_for :users, controllers: {
  omniauth_callbacks: 'users/omniauth_callbacks'
}
```

### Views

```erb
<!-- app/views/devise/sessions/new.html.erb -->
<h2>Log in</h2>

<%= form_for(resource, as: resource_name, url: session_path(resource_name)) do |f| %>
  <!-- Email/Password fields -->
<% end %>

<div class="oauth-buttons">
  <%= button_to "Sign in with Google", 
      user_google_oauth2_omniauth_authorize_path, 
      method: :post,
      data: { turbo: false },
      class: "btn btn-google" %>
  
  <%= button_to "Sign in with GitHub", 
      user_github_omniauth_authorize_path, 
      method: :post,
      data: { turbo: false },
      class: "btn btn-github" %>
      
  <%= button_to "Sign in with Microsoft", 
      user_microsoft_office365_omniauth_authorize_path, 
      method: :post,
      data: { turbo: false },
      class: "btn btn-microsoft" %>
</div>
```

### Linking Multiple Providers

```ruby
# app/models/user.rb
class User < ApplicationRecord
  has_many :oauth_identities, dependent: :destroy
end

class OauthIdentity < ApplicationRecord
  belongs_to :user
  
  validates :provider, :uid, presence: true
  validates :uid, uniqueness: { scope: :provider }
end

# Migration
class CreateOauthIdentities < ActiveRecord::Migration[7.0]
  def change
    create_table :oauth_identities do |t|
      t.references :user, null: false, foreign_key: true
      t.string :provider, null: false
      t.string :uid, null: false
      t.string :oauth_token
      t.datetime :oauth_expires_at
      t.json :raw_info

      t.timestamps
    end
    
    add_index :oauth_identities, [:provider, :uid], unique: true
  end
end

# Controller
class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    if user_signed_in?
      # Link account
      @identity = current_user.oauth_identities.find_or_initialize_by(
        provider: auth.provider,
        uid: auth.uid
      )
      @identity.update!(
        oauth_token: auth.credentials.token,
        oauth_expires_at: Time.at(auth.credentials.expires_at),
        raw_info: auth.to_hash
      )
      redirect_to profile_path, notice: "Google account linked successfully"
    else
      # Sign in or sign up
      @identity = OauthIdentity.find_by(provider: auth.provider, uid: auth.uid)
      
      if @identity
        sign_in_and_redirect @identity.user
      else
        @user = User.create!(
          email: auth.info.email,
          password: Devise.friendly_token[0, 20],
          name: auth.info.name
        )
        @identity = @user.oauth_identities.create!(
          provider: auth.provider,
          uid: auth.uid,
          oauth_token: auth.credentials.token,
          oauth_expires_at: Time.at(auth.credentials.expires_at),
          raw_info: auth.to_hash
        )
        sign_in_and_redirect @user
      end
    end
  end
end
```

### Calendar OAuth Scopes

```ruby
# For Google Calendar
config.omniauth :google_oauth2,
                ENV['GOOGLE_CLIENT_ID'],
                ENV['GOOGLE_CLIENT_SECRET'],
                {
                  scope: 'email,profile,calendar.readonly,calendar.events',
                  access_type: 'offline',
                  prompt: 'consent'
                }

# For Microsoft Calendar
config.omniauth :microsoft_office365,
                ENV['MICROSOFT_CLIENT_ID'],
                ENV['MICROSOFT_CLIENT_SECRET'],
                {
                  scope: 'openid email profile Calendars.ReadWrite'
                }

# Refresh token handling
class User < ApplicationRecord
  def refresh_google_token!
    return unless oauth_expires_at < 5.minutes.from_now
    
    response = HTTParty.post(
      'https://oauth2.googleapis.com/token',
      body: {
        client_id: ENV['GOOGLE_CLIENT_ID'],
        client_secret: ENV['GOOGLE_CLIENT_SECRET'],
        refresh_token: oauth_refresh_token,
        grant_type: 'refresh_token'
      }
    )
    
    update!(
      oauth_token: response['access_token'],
      oauth_expires_at: Time.current + response['expires_in'].seconds
    )
  end
end
```

---

## Session Management

### Session Store Options

```ruby
# config/initializers/session_store.rb

# Cookie-based (default, 4KB limit)
Rails.application.config.session_store :cookie_store, 
  key: '_myapp_session',
  expire_after: 2.weeks

# Cache-based (Redis recommended)
Rails.application.config.session_store :cache_store,
  key: '_myapp_session',
  expire_after: 30.minutes

# Active Record (database)
Rails.application.config.session_store :active_record_store,
  key: '_myapp_session'

# Redis store
Rails.application.config.session_store :redis_store,
  servers: ENV['REDIS_URL'],
  expire_after: 90.minutes,
  key: '_myapp_session',
  threadsafe: true
```

### Session Security

```ruby
# config/initializers/session_store.rb
Rails.application.config.session_store :cookie_store,
  key: '_myapp_session',
  secure: Rails.env.production?,    # HTTPS only in production
  httponly: true,                    # Not accessible via JavaScript
  same_site: :lax,                   # CSRF protection
  expire_after: 2.weeks

# Force SSL in production
# config/environments/production.rb
config.force_ssl = true
```

### Custom Session Management

```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  before_action :check_session_expiry
  after_action :update_last_activity

  private

  def check_session_expiry
    if session[:last_activity] && 
       session[:last_activity] < 30.minutes.ago.to_i
      reset_session
      redirect_to login_path, alert: "Session expired. Please log in again."
    end
  end

  def update_last_activity
    session[:last_activity] = Time.current.to_i if user_signed_in?
  end
end
```

### Remember Me Implementation

```ruby
# Manual remember me token
class User < ApplicationRecord
  def generate_remember_token
    self.remember_token = SecureRandom.urlsafe_base64
    self.remember_token_expires_at = 2.weeks.from_now
    save!
  end
  
  def clear_remember_token
    update(remember_token: nil, remember_token_expires_at: nil)
  end
  
  def self.find_by_remember_token(token)
    user = find_by(remember_token: token)
    user if user && user.remember_token_expires_at > Time.current
  end
end

# In sessions controller
def create
  user = User.find_by(email: params[:email])
  
  if user&.authenticate(params[:password])
    session[:user_id] = user.id
    
    if params[:remember_me] == '1'
      user.generate_remember_token
      cookies.permanent.encrypted[:remember_token] = user.remember_token
    end
    
    redirect_to root_path
  else
    flash.now[:alert] = "Invalid credentials"
    render :new
  end
end

def destroy
  current_user.clear_remember_token if current_user
  cookies.delete(:remember_token)
  reset_session
  redirect_to root_path
end

# In application controller
def current_user
  @current_user ||= session[:user_id] && User.find_by(id: session[:user_id])
  @current_user ||= remember_user_from_cookie
end

def remember_user_from_cookie
  return unless cookies.encrypted[:remember_token]
  
  user = User.find_by_remember_token(cookies.encrypted[:remember_token])
  session[:user_id] = user.id if user
  user
end
```

---

# Ruby on Rails - Authentication & Authorization

---

## JWT Authentication

JSON Web Tokens (JWT) are commonly used for stateless authentication, especially in API-only applications.

### What is JWT?

A JWT consists of three parts separated by dots:
```
header.payload.signature
```

**Example JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJleHAiOjE2MzI0ODQ4MDB9.signature
```

**Structure:**
- **Header**: Algorithm and token type
- **Payload**: Claims (user data)
- **Signature**: Verification signature

### Setup JWT in Rails

```ruby
# Gemfile
gem 'jwt'
gem 'bcrypt' # For password hashing

# app/lib/json_web_token.rb
class JsonWebToken
  SECRET_KEY = Rails.application.credentials.secret_key_base
  
  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end
  
  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::DecodeError => e
    nil
  end
end
```

### Authentication Controller

```ruby
# app/controllers/api/v1/authentication_controller.rb
module Api
  module V1
    class AuthenticationController < ApplicationController
      skip_before_action :authenticate_request, only: [:login]
      
      # POST /api/v1/login
      def login
        user = User.find_by(email: params[:email])
        
        if user&.authenticate(params[:password])
          token = JsonWebToken.encode(user_id: user.id)
          render json: {
            token: token,
            user: UserSerializer.new(user),
            exp: 24.hours.from_now.strftime("%m-%d-%Y %H:%M")
          }, status: :ok
        else
          render json: { error: 'Invalid credentials' }, status: :unauthorized
        end
      end
      
      # POST /api/v1/logout
      def logout
        # For JWT, logout is handled client-side by removing token
        # Optionally, implement token blacklist
        head :no_content
      end
    end
  end
end
```

### Authorization with JWT

```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  before_action :authenticate_request
  
  attr_reader :current_user
  
  private
  
  def authenticate_request
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    
    decoded = JsonWebToken.decode(token)
    
    if decoded
      @current_user = User.find_by(id: decoded[:user_id])
      render json: { error: 'Unauthorized' }, status: :unauthorized unless @current_user
    else
      render json: { error: 'Invalid token' }, status: :unauthorized
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :unauthorized
  end
end
```

### JWT with Refresh Tokens

```ruby
# app/models/user.rb
class User < ApplicationRecord
  has_secure_password
  has_many :refresh_tokens, dependent: :destroy
end

# app/models/refresh_token.rb
class RefreshToken < ApplicationRecord
  belongs_to :user
  
  before_create :generate_token
  
  def generate_token
    self.token = SecureRandom.hex(32)
    self.expires_at = 7.days.from_now
  end
  
  def expired?
    expires_at < Time.current
  end
  
  def self.cleanup_expired
    where('expires_at < ?', Time.current).delete_all
  end
end

# Migration
class CreateRefreshTokens < ActiveRecord::Migration[7.0]
  def change
    create_table :refresh_tokens do |t|
      t.references :user, null: false, foreign_key: true
      t.string :token, null: false
      t.datetime :expires_at, null: false
      t.timestamps
    end
    
    add_index :refresh_tokens, :token, unique: true
  end
end
```

### Refresh Token Implementation

```ruby
# app/controllers/api/v1/authentication_controller.rb
def login
  user = User.find_by(email: params[:email])
  
  if user&.authenticate(params[:password])
    access_token = JsonWebToken.encode({ user_id: user.id }, 15.minutes.from_now)
    refresh_token = user.refresh_tokens.create!
    
    render json: {
      access_token: access_token,
      refresh_token: refresh_token.token,
      token_type: 'Bearer',
      expires_in: 900 # 15 minutes in seconds
    }, status: :ok
  else
    render json: { error: 'Invalid credentials' }, status: :unauthorized
  end
end

def refresh
  refresh_token = RefreshToken.find_by(token: params[:refresh_token])
  
  if refresh_token && !refresh_token.expired?
    access_token = JsonWebToken.encode({ user_id: refresh_token.user_id }, 15.minutes.from_now)
    
    render json: {
      access_token: access_token,
      token_type: 'Bearer',
      expires_in: 900
    }, status: :ok
  else
    refresh_token&.destroy # Remove expired token
    render json: { error: 'Invalid or expired refresh token' }, status: :unauthorized
  end
end
```

### JWT Token Blacklist (for logout)

```ruby
# app/models/blacklisted_token.rb
class BlacklistedToken < ApplicationRecord
  validates :jti, presence: true, uniqueness: true
  
  def self.revoked?(jti)
    exists?(jti: jti)
  end
  
  def self.cleanup_expired
    where('exp < ?', Time.current.to_i).delete_all
  end
end

# Migration
class CreateBlacklistedTokens < ActiveRecord::Migration[7.0]
  def change
    create_table :blacklisted_tokens do |t|
      t.string :jti, null: false
      t.integer :exp, null: false
      t.timestamps
    end
    
    add_index :blacklisted_tokens, :jti, unique: true
  end
end

# Updated JWT encode with JTI
class JsonWebToken
  def self.encode(payload, exp = 15.minutes.from_now)
    payload[:exp] = exp.to_i
    payload[:jti] = SecureRandom.uuid
    JWT.encode(payload, SECRET_KEY)
  end
  
  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY)[0]
    return nil if BlacklistedToken.revoked?(decoded['jti'])
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::DecodeError
    nil
  end
end

# Logout implementation
def logout
  header = request.headers['Authorization']
  token = header.split(' ').last if header
  decoded = JsonWebToken.decode(token)
  
  if decoded
    BlacklistedToken.create!(jti: decoded[:jti], exp: decoded[:exp])
    render json: { message: 'Logged out successfully' }, status: :ok
  else
    render json: { error: 'Invalid token' }, status: :unauthorized
  end
end
```

### JWT Best Practices

1. **Short-lived access tokens**: 15-30 minutes
2. **Use refresh tokens**: For long-term sessions
3. **Secure secret key**: Use Rails credentials
4. **Token blacklist**: For logout functionality
5. **HTTPS only**: Never send tokens over HTTP
6. **Store securely**: Client-side storage considerations
7. **Add claims**: Include only necessary data
8. **Validate expiration**: Always check `exp` claim

---

## Authorization Patterns

### Role-Based Access Control (RBAC)

Users have roles, roles have permissions.

```ruby
# app/models/user.rb
class User < ApplicationRecord
  enum role: { user: 0, moderator: 1, admin: 2 }
  
  def admin?
    role == 'admin'
  end
  
  def moderator_or_above?
    moderator? || admin?
  end
end

# Usage in controllers
class ArticlesController < ApplicationController
  before_action :require_admin, only: [:destroy]
  
  private
  
  def require_admin
    unless current_user&.admin?
      render json: { error: 'Unauthorized' }, status: :forbidden
    end
  end
end
```

### Attribute-Based Access Control (ABAC)

Access based on attributes of user, resource, and environment.

```ruby
# app/models/document.rb
class Document < ApplicationRecord
  belongs_to :user
  belongs_to :department
  
  enum visibility: { private: 0, department: 1, company: 2, public: 3 }
end

# app/services/document_access_policy.rb
class DocumentAccessPolicy
  def initialize(user, document)
    @user = user
    @document = document
  end
  
  def can_view?
    return true if @document.public?
    return true if @user.admin?
    return true if @document.user_id == @user.id
    return true if @document.department? && @user.department_id == @document.department_id
    return true if @document.company? && @user.company_id == @document.company_id
    false
  end
  
  def can_edit?
    return true if @user.admin?
    return true if @document.user_id == @user.id
    false
  end
end

# Usage
policy = DocumentAccessPolicy.new(current_user, document)
render json: { error: 'Forbidden' }, status: :forbidden unless policy.can_view?
```

### Resource-Level Permissions

```ruby
# app/models/project.rb
class Project < ApplicationRecord
  has_many :project_members
  has_many :users, through: :project_members
end

# app/models/project_member.rb
class ProjectMember < ApplicationRecord
  belongs_to :project
  belongs_to :user
  
  enum role: { viewer: 0, contributor: 1, owner: 2 }
  
  def can_edit?
    contributor? || owner?
  end
  
  def can_delete?
    owner?
  end
end

# Usage
class ProjectsController < ApplicationController
  def update
    @project = Project.find(params[:id])
    membership = @project.project_members.find_by(user: current_user)
    
    unless membership&.can_edit?
      render json: { error: 'Insufficient permissions' }, status: :forbidden
      return
    end
    
    # Update logic
  end
end
```

### Policy Object Pattern

```ruby
# app/policies/article_policy.rb
class ArticlePolicy
  attr_reader :user, :article
  
  def initialize(user, article)
    @user = user
    @article = article
  end
  
  def create?
    user.present?
  end
  
  def update?
    user.admin? || article.user_id == user.id
  end
  
  def destroy?
    user.admin?
  end
  
  def publish?
    user.admin? || (user.moderator? && article.user_id == user.id)
  end
end

# Usage in controller
def update
  @article = Article.find(params[:id])
  policy = ArticlePolicy.new(current_user, @article)
  
  unless policy.update?
    render json: { error: 'Not authorized' }, status: :forbidden
    return
  end
  
  # Update logic
end
```

---

## Pundit

Pundit is a popular authorization library using policy objects.

### Installation

```ruby
# Gemfile
gem 'pundit'

# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  include Pundit::Authorization
  
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  
  private
  
  def user_not_authorized
    flash[:alert] = "You are not authorized to perform this action."
    redirect_to(request.referrer || root_path)
  end
end
```

### Creating Policies

```ruby
# Generate policy
rails generate pundit:policy Article

# app/policies/article_policy.rb
class ArticlePolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user.admin?
        scope.all
      else
        scope.where(published: true).or(scope.where(user: user))
      end
    end
  end
  
  def index?
    true
  end
  
  def show?
    record.published? || user_is_owner?
  end
  
  def create?
    user.present?
  end
  
  def update?
    user_is_owner? || user.admin?
  end
  
  def destroy?
    user.admin? || user_is_owner?
  end
  
  def publish?
    user.admin? || (user.moderator? && user_is_owner?)
  end
  
  private
  
  def user_is_owner?
    record.user_id == user.id
  end
end

# app/policies/application_policy.rb
class ApplicationPolicy
  attr_reader :user, :record
  
  def initialize(user, record)
    @user = user
    @record = record
  end
  
  def index?
    false
  end
  
  def show?
    false
  end
  
  def create?
    false
  end
  
  def new?
    create?
  end
  
  def update?
    false
  end
  
  def edit?
    update?
  end
  
  def destroy?
    false
  end
  
  class Scope
    attr_reader :user, :scope
    
    def initialize(user, scope)
      @user = user
      @scope = scope
    end
    
    def resolve
      raise NotImplementedError
    end
  end
end
```

### Using Pundit in Controllers

```ruby
class ArticlesController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @articles = policy_scope(Article)
  end
  
  def show
    @article = Article.find(params[:id])
    authorize @article
  end
  
  def create
    @article = Article.new(article_params)
    @article.user = current_user
    authorize @article
    
    if @article.save
      redirect_to @article
    else
      render :new
    end
  end
  
  def update
    @article = Article.find(params[:id])
    authorize @article
    
    if @article.update(article_params)
      redirect_to @article
    else
      render :edit
    end
  end
  
  def destroy
    @article = Article.find(params[:id])
    authorize @article
    @article.destroy
    redirect_to articles_path
  end
  
  def publish
    @article = Article.find(params[:id])
    authorize @article
    @article.update(published: true)
    redirect_to @article
  end
end
```

### Policy Scopes

```ruby
# Filtering collections based on permissions
class ArticlePolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      case user.role
      when 'admin'
        scope.all
      when 'moderator'
        scope.where(published: true)
          .or(scope.where(user: user))
          .or(scope.where(department: user.department))
      else
        scope.where(published: true).or(scope.where(user: user))
      end
    end
  end
end

# Usage
@articles = policy_scope(Article)
@published_articles = policy_scope(Article.published)
```

### Conditional Rendering in Views

```ruby
# app/views/articles/show.html.erb
<% if policy(@article).update? %>
  <%= link_to 'Edit', edit_article_path(@article) %>
<% end %>

<% if policy(@article).destroy? %>
  <%= link_to 'Delete', article_path(@article), method: :delete %>
<% end %>

<% if policy(@article).publish? %>
  <%= link_to 'Publish', publish_article_path(@article), method: :post %>
<% end %>
```

### Pundit with API

```ruby
class Api::V1::ArticlesController < ApplicationController
  include Pundit::Authorization
  
  rescue_from Pundit::NotAuthorizedError do |exception|
    render json: {
      error: 'Not authorized',
      message: exception.message
    }, status: :forbidden
  end
  
  def index
    @articles = policy_scope(Article)
    render json: @articles
  end
  
  def show
    @article = Article.find(params[:id])
    authorize @article
    render json: @article
  end
  
  def update
    @article = Article.find(params[:id])
    authorize @article
    
    if @article.update(article_params)
      render json: @article
    else
      render json: { errors: @article.errors }, status: :unprocessable_entity
    end
  end
end
```

### Headless Policies (No Record)

```ruby
# app/policies/dashboard_policy.rb
class DashboardPolicy < Struct.new(:user, :dashboard)
  def show?
    user.admin? || user.moderator?
  end
end

# Usage
authorize :dashboard, :show?
```

### Testing Pundit Policies

```ruby
# spec/policies/article_policy_spec.rb
require 'rails_helper'

RSpec.describe ArticlePolicy do
  subject { described_class.new(user, article) }
  
  let(:article) { create(:article) }
  
  context 'for a visitor' do
    let(:user) { nil }
    
    it { is_expected.to forbid_action(:show) }
    it { is_expected.to forbid_action(:create) }
    it { is_expected.to forbid_action(:update) }
    it { is_expected.to forbid_action(:destroy) }
  end
  
  context 'for a regular user' do
    let(:user) { create(:user) }
    
    context 'viewing published article' do
      let(:article) { create(:article, published: true) }
      it { is_expected.to permit_action(:show) }
    end
    
    context 'viewing own unpublished article' do
      let(:article) { create(:article, user: user, published: false) }
      it { is_expected.to permit_action(:show) }
      it { is_expected.to permit_action(:update) }
    end
    
    context "viewing another user's unpublished article" do
      let(:article) { create(:article, published: false) }
      it { is_expected.to forbid_action(:show) }
      it { is_expected.to forbid_action(:update) }
    end
    
    it { is_expected.to permit_action(:create) }
    it { is_expected.to forbid_action(:destroy) }
  end
  
  context 'for an admin' do
    let(:user) { create(:user, role: :admin) }
    
    it { is_expected.to permit_action(:show) }
    it { is_expected.to permit_action(:create) }
    it { is_expected.to permit_action(:update) }
    it { is_expected.to permit_action(:destroy) }
    it { is_expected.to permit_action(:publish) }
  end
  
  describe 'Scope' do
    let!(:published_article) { create(:article, published: true) }
    let!(:unpublished_article) { create(:article, published: false) }
    let!(:user_article) { create(:article, user: user, published: false) }
    
    context 'for admin' do
      let(:user) { create(:user, role: :admin) }
      
      it 'returns all articles' do
        expect(Pundit.policy_scope(user, Article).count).to eq(3)
      end
    end
    
    context 'for regular user' do
      let(:user) { create(:user) }
      
      it 'returns published articles and own articles' do
        scope = Pundit.policy_scope(user, Article)
        expect(scope).to include(published_article, user_article)
        expect(scope).not_to include(unpublished_article)
      end
    end
  end
end
```

---

## CanCanCan

CanCanCan is another popular authorization library using an ability-based approach.

### Installation

```ruby
# Gemfile
gem 'cancancan'

# app/models/ability.rb
rails generate cancan:ability
```

### Defining Abilities

```ruby
# app/models/ability.rb
class Ability
  include CanCan::Ability
  
  def initialize(user)
    user ||= User.new # guest user (not logged in)
    
    if user.admin?
      can :manage, :all
    elsif user.moderator?
      can :read, :all
      can :manage, Article, user_id: user.id
      can :publish, Article
      can :manage, Comment
    elsif user.persisted?
      can :read, Article, published: true
      can :read, Article, user_id: user.id
      can :create, Article
      can :update, Article, user_id: user.id
      can :destroy, Article, user_id: user.id
      can :manage, Comment, user_id: user.id
    else
      can :read, Article, published: true
    end
  end
end
```

### Usage in Controllers

```ruby
class ArticlesController < ApplicationController
  load_and_authorize_resource
  
  def index
    # @articles is automatically loaded and scoped
  end
  
  def show
    # @article is automatically loaded and authorized
  end
  
  def create
    # @article is automatically built and authorized
    if @article.save
      redirect_to @article
    else
      render :new
    end
  end
  
  def update
    # @article is automatically loaded and authorized
    if @article.update(article_params)
      redirect_to @article
    else
      render :edit
    end
  end
  
  # Manual authorization
  def publish
    @article = Article.find(params[:id])
    authorize! :publish, @article
    @article.update(published: true)
    redirect_to @article
  end
end

# Error handling
class ApplicationController < ActionController::Base
  rescue_from CanCan::AccessDenied do |exception|
    respond_to do |format|
      format.html { redirect_to root_path, alert: exception.message }
      format.json { render json: { error: exception.message }, status: :forbidden }
    end
  end
end
```

### Complex Abilities

```ruby
class Ability
  include CanCan::Ability
  
  def initialize(user)
    user ||= User.new
    
    # Multiple conditions
    can :read, Article, published: true
    can :read, Article, user_id: user.id
    
    # Block conditions (more complex logic)
    can :update, Article do |article|
      article.user_id == user.id && !article.locked?
    end
    
    # Hash conditions with associations
    can :read, Comment, article: { published: true }
    
    # Combining conditions
    can :manage, Project, team_members: { user_id: user.id, role: 'owner' }
    
    # Cannot (deny permissions)
    cannot :destroy, Article, featured: true
    
    # Attributes (strong parameters integration)
    can :update, Article, [:title, :content]
    cannot :update, Article, [:user_id, :published]
  end
end
```

### Checking Abilities

```ruby
# In controllers
if can? :update, @article
  # Do something
end

unless cannot? :publish, @article
  # Do something
end

# Multiple abilities
if can?(:update, @article) && can?(:publish, @article)
  # Do something
end

# In views
<% if can? :update, @article %>
  <%= link_to 'Edit', edit_article_path(@article) %>
<% end %>

<% if can? :destroy, @article %>
  <%= link_to 'Delete', article_path(@article), method: :delete %>
<% end %>
```

### Accessible Attributes (Strong Parameters)

```ruby
class Ability
  include CanCan::Ability
  
  def initialize(user)
    if user.admin?
      can :manage, Article
    else
      can :create, Article
      can :update, Article, user_id: user.id
      # Restrict which attributes can be updated
      can [:update, :create], Article, [:title, :content, :category_id]
      cannot [:update, :create], Article, [:published, :featured, :user_id]
    end
  end
end

# In controller
def article_params
  params.require(:article).permit(
    *current_ability.permitted_attributes(:update, Article)
  )
end
```

### Fetching Records

```ruby
# Accessible by current user
@articles = Article.accessible_by(current_ability)

# With specific action
@editable_articles = Article.accessible_by(current_ability, :update)

# In controller with pagination
def index
  @articles = Article.accessible_by(current_ability).page(params[:page])
end
```

### Testing Abilities

```ruby
# spec/models/ability_spec.rb
require 'rails_helper'
require 'cancan/matchers'

RSpec.describe Ability do
  subject(:ability) { Ability.new(user) }
  
  context 'when user is an admin' do
    let(:user) { create(:user, role: :admin) }
    
    it { is_expected.to be_able_to(:manage, Article.new) }
    it { is_expected.to be_able_to(:manage, Comment.new) }
    it { is_expected.to be_able_to(:manage, User.new) }
  end
  
  context 'when user is a regular user' do
    let(:user) { create(:user) }
    let(:own_article) { create(:article, user: user) }
    let(:other_article) { create(:article) }
    
    it { is_expected.to be_able_to(:create, Article.new) }
    it { is_expected.to be_able_to(:read, create(:article, published: true)) }
    it { is_expected.to be_able_to(:update, own_article) }
    it { is_expected.not_to be_able_to(:update, other_article) }
    it { is_expected.not_to be_able_to(:destroy, other_article) }
    it { is_expected.not_to be_able_to(:publish, own_article) }
  end
  
  context 'when user is a guest' do
    let(:user) { nil }
    
    it { is_expected.to be_able_to(:read, create(:article, published: true)) }
    it { is_expected.not_to be_able_to(:create, Article.new) }
    it { is_expected.not_to be_able_to(:update, Article.new) }
  end
end
```

### CanCanCan vs Pundit

**CanCanCan:**
- Centralized ability definitions
- DSL-based approach
- Good for simple to medium complexity
- Easier to see all permissions in one place
- `load_and_authorize_resource` is convenient

**Pundit:**
- Policy objects (one per model)
- Object-oriented approach
- Better for complex permissions
- More testable and maintainable
- Explicit authorization calls

---

## Security Best Practices

### 1. Password Security

#### Strong Password Requirements
```ruby
# app/models/user.rb
class User < ApplicationRecord
  validates :password, 
    length: { minimum: 12 },
    format: { 
      with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      message: "must include uppercase, lowercase, number, and special character"
    },
    if: :password_required?
    
  # Check against common passwords
  validate :password_complexity
  
  private
  
  def password_complexity
    common_passwords = %w[password123 qwerty123 admin123]
    if common_passwords.include?(password&.downcase)
      errors.add(:password, "is too common")
    end
  end
end
```

#### Password Hashing with BCrypt
```ruby
# Devise uses bcrypt by default
# For custom implementation:
gem 'bcrypt'

class User < ApplicationRecord
  has_secure_password
  
  # BCrypt automatically:
  # - Salts passwords (unique per user)
  # - Uses adaptive hashing (slow by design)
  # - Stores hash in password_digest column
end

# Password verification
user.authenticate('password123') # Returns user or false
```

#### Prevent Timing Attacks
```ruby
# Bad - vulnerable to timing attacks
def authenticate(email, password)
  user = User.find_by(email: email)
  return nil unless user
  return user if user.password == password
  nil
end

# Good - constant time comparison
def authenticate(email, password)
  user = User.find_by(email: email)
  
  # Always perform hash comparison even if user not found
  password_digest = user&.password_digest || BCrypt::Password.create('dummy')
  
  if BCrypt::Password.new(password_digest) == password && user
    user
  else
    nil
  end
end
```

### 2. Session Security

#### Secure Session Configuration
```ruby
# config/initializers/session_store.rb
Rails.application.config.session_store :cookie_store,
  key: '_app_session',
  secure: Rails.env.production?,  # HTTPS only in production
  httponly: true,                  # Not accessible via JavaScript
  same_site: :lax,                 # CSRF protection
  expire_after: 30.minutes

# For API applications using Redis
Rails.application.config.session_store :redis_store,
  servers: ENV['REDIS_URL'],
  expire_after: 30.minutes,
  key: '_app_session',
  secure: Rails.env.production?,
  httponly: true,
  same_site: :strict
```

#### Session Fixation Prevention
```ruby
# Rails automatically handles this, but be aware:
class SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      # Reset session to prevent fixation attacks
      reset_session
      session[:user_id] = user.id
      redirect_to dashboard_path
    else
      flash.now[:alert] = "Invalid credentials"
      render :new
    end
  end
  
  def destroy
    # Always reset session on logout
    reset_session
    redirect_to root_path
  end
end
```

#### Session Timeout
```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  before_action :check_session_timeout
  
  private
  
  def check_session_timeout
    if current_user && session_expired?
      reset_session
      redirect_to login_path, alert: "Your session has expired"
    elsif current_user
      update_session_timestamp
    end
  end
  
  def session_expired?
    last_activity = session[:last_activity_at]
    return true unless last_activity
    
    Time.current - Time.parse(last_activity) > 30.minutes
  end
  
  def update_session_timestamp
    session[:last_activity_at] = Time.current.to_s
  end
end
```

### 3. CSRF Protection

#### Built-in Rails Protection
```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  # Enabled by default
  protect_from_forgery with: :exception
  
  # For API controllers
  protect_from_forgery with: :null_session
end
```

#### CSRF Token in Forms
```erb
<!-- Rails automatically includes CSRF token -->
<%= form_with model: @user do |f| %>
  <%= f.text_field :name %>
  <%= f.submit %>
<% end %>

<!-- Manual token inclusion -->
<form>
  <%= hidden_field_tag :authenticity_token, form_authenticity_token %>
</form>
```

#### CSRF for AJAX Requests
```javascript
// application.js
document.addEventListener('DOMContentLoaded', () => {
  const token = document.querySelector('meta[name="csrf-token"]').content;
  
  fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    },
    body: JSON.stringify({ name: 'John' })
  });
});
```

```ruby
# app/views/layouts/application.html.erb
<head>
  <%= csrf_meta_tags %>
</head>
```

### 4. Token Security (JWT & API Keys)

#### JWT Best Practices
```ruby
class JsonWebToken
  SECRET_KEY = Rails.application.credentials.secret_key_base
  
  def self.encode(payload, exp = 24.hours.from_now)
    # Add expiration
    payload[:exp] = exp.to_i
    
    # Add issued at
    payload[:iat] = Time.current.to_i
    
    # Add JWT ID for revocation tracking
    payload[:jti] = SecureRandom.uuid
    
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end
  
  def self.decode(token)
    # Verify expiration automatically
    decoded = JWT.decode(
      token, 
      SECRET_KEY, 
      true, 
      { algorithm: 'HS256', verify_expiration: true }
    )
    
    # Check if token is revoked
    jti = decoded[0]['jti']
    raise JWT::DecodeError if TokenBlacklist.exists?(jti: jti)
    
    HashWithIndifferentAccess.new(decoded[0])
  rescue JWT::DecodeError, JWT::ExpiredSignature => e
    nil
  end
end
```

#### Token Revocation (Blacklist)
```ruby
# app/models/token_blacklist.rb
class TokenBlacklist < ApplicationRecord
  # Columns: jti (string), exp (datetime), created_at
  
  def self.revoke(token)
    decoded = JWT.decode(token, nil, false)
    jti = decoded[0]['jti']
    exp = Time.at(decoded[0]['exp'])
    
    create!(jti: jti, exp: exp)
  end
  
  # Cleanup expired tokens (run daily)
  def self.cleanup_expired
    where('exp < ?', Time.current).delete_all
  end
end

# In your logout endpoint
class Api::SessionsController < ApiController
  def destroy
    token = request.headers['Authorization']&.split(' ')&.last
    TokenBlacklist.revoke(token) if token
    
    head :no_content
  end
end
```

#### Secure Token Storage
```ruby
# app/models/api_key.rb
class ApiKey < ApplicationRecord
  before_create :generate_key
  
  def self.authenticate(key)
    # Use secure comparison to prevent timing attacks
    find_by(key: key)&.touch(:last_used_at)
  end
  
  private
  
  def generate_key
    # Generate cryptographically secure random key
    self.key = SecureRandom.base58(32)
    
    # Store hashed version
    self.key_digest = Digest::SHA256.hexdigest(key)
  end
end

# Store only hashed version in database
# Give user the plain key only once on creation
```

#### Refresh Token Pattern
```ruby
class RefreshToken < ApplicationRecord
  belongs_to :user
  
  before_create :generate_token
  
  # Longer expiration than access token
  def expired?
    expires_at < Time.current
  end
  
  def revoke!
    update!(revoked_at: Time.current)
  end
  
  private
  
  def generate_token
    self.token = SecureRandom.hex(32)
    self.expires_at = 30.days.from_now
  end
end

# Controller
class Api::TokensController < ApiController
  def refresh
    refresh_token = RefreshToken.find_by(token: params[:refresh_token])
    
    if refresh_token && !refresh_token.expired? && !refresh_token.revoked_at
      # Generate new access token
      access_token = JsonWebToken.encode(user_id: refresh_token.user_id)
      
      # Optionally rotate refresh token
      new_refresh_token = refresh_token.user.refresh_tokens.create!
      refresh_token.revoke!
      
      render json: {
        access_token: access_token,
        refresh_token: new_refresh_token.token
      }
    else
      render json: { error: 'Invalid refresh token' }, status: :unauthorized
    end
  end
end
```

### 5. Rate Limiting

#### Rack Attack Configuration
```ruby
# Gemfile
gem 'rack-attack'

# config/initializers/rack_attack.rb
class Rack::Attack
  # Throttle login attempts by email
  throttle('login/email', limit: 5, period: 20.minutes) do |req|
    if req.path == '/login' && req.post?
      req.params['email'].to_s.downcase.presence
    end
  end
  
  # Throttle login attempts by IP
  throttle('login/ip', limit: 10, period: 20.minutes) do |req|
    req.ip if req.path == '/login' && req.post?
  end
  
  # Throttle API requests
  throttle('api/ip', limit: 100, period: 1.hour) do |req|
    req.ip if req.path.start_with?('/api')
  end
  
  # Throttle by authenticated user
  throttle('api/user', limit: 300, period: 1.hour) do |req|
    req.env['current_user']&.id if req.path.start_with?('/api')
  end
  
  # Block specific IPs
  blocklist('block bad actors') do |req|
    BadActor.exists?(ip: req.ip)
  end
  
  # Allow specific IPs (like internal tools)
  safelist('allow trusted IPs') do |req|
    ['127.0.0.1', '::1'].include?(req.ip)
  end
end

# Custom response for throttled requests
Rack::Attack.throttled_responder = lambda do |env|
  retry_after = env['rack.attack.match_data'][:period]
  [
    429,
    {
      'Content-Type' => 'application/json',
      'Retry-After' => retry_after.to_s
    },
    [{ error: 'Rate limit exceeded' }.to_json]
  ]
end

# config/application.rb
config.middleware.use Rack::Attack
```

#### Custom Rate Limiting with Redis
```ruby
class RateLimiter
  def initialize(key:, limit:, period:)
    @redis = Redis.current
    @key = "rate_limit:#{key}"
    @limit = limit
    @period = period
  end
  
  def exceeded?
    current = @redis.get(@key).to_i
    current >= @limit
  end
  
  def increment!
    count = @redis.incr(@key)
    @redis.expire(@key, @period) if count == 1
    count
  end
  
  def remaining
    current = @redis.get(@key).to_i
    [@limit - current, 0].max
  end
end

# Usage in controller
class Api::UsersController < ApiController
  before_action :check_rate_limit
  
  private
  
  def check_rate_limit
    limiter = RateLimiter.new(
      key: "api:#{current_user.id}",
      limit: 100,
      period: 1.hour
    )
    
    if limiter.exceeded?
      render json: { 
        error: 'Rate limit exceeded',
        retry_after: 3600
      }, status: :too_many_requests
      return
    end
    
    limiter.increment!
    
    # Add headers
    response.headers['X-RateLimit-Limit'] = '100'
    response.headers['X-RateLimit-Remaining'] = limiter.remaining.to_s
  end
end
```

### 6. SQL Injection Prevention

#### Safe Query Patterns
```ruby
# BAD - Vulnerable to SQL injection
User.where("email = '#{params[:email]}'")
User.where("status = #{params[:status]}")

# GOOD - Use parameterized queries
User.where("email = ?", params[:email])
User.where(email: params[:email])
User.where("email = :email", email: params[:email])

# BAD - String interpolation in order clause
User.order("#{params[:sort_column]} #{params[:direction]}")

# GOOD - Whitelist allowed columns
ALLOWED_SORT_COLUMNS = %w[name email created_at].freeze
ALLOWED_DIRECTIONS = %w[asc desc].freeze

sort_column = ALLOWED_SORT_COLUMNS.include?(params[:sort]) ? params[:sort] : 'created_at'
direction = ALLOWED_DIRECTIONS.include?(params[:dir]) ? params[:dir] : 'desc'

User.order("#{sort_column} #{direction}")

# Or use Arel
User.order(User.arel_table[sort_column.to_sym].send(direction))
```

#### Raw SQL Safety
```ruby
# When you must use raw SQL, sanitize inputs
query = <<-SQL
  SELECT * FROM users 
  WHERE email = ? 
  AND status = ?
SQL

User.find_by_sql([query, params[:email], params[:status]])

# Or use sanitize_sql_array
sanitized_query = User.sanitize_sql_array([
  "email = ? AND status = ?", 
  params[:email], 
  params[:status]
])
User.where(sanitized_query)
```

### 7. Mass Assignment Protection

#### Strong Parameters
```ruby
class UsersController < ApplicationController
  def create
    # BAD - Mass assignment vulnerability
    # User.create(params[:user])
    
    # GOOD - Whitelist permitted attributes
    user = User.create(user_params)
    
    if user.persisted?
      render json: user, status: :created
    else
      render json: { errors: user.errors }, status: :unprocessable_entity
    end
  end
  
  def update
    user = User.find(params[:id])
    
    # Prevent privilege escalation
    if user.update(user_params)
      render json: user
    else
      render json: { errors: user.errors }, status: :unprocessable_entity
    end
  end
  
  private
  
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
    
    # Never permit sensitive attributes like:
    # - :admin
    # - :role
    # - :is_superuser
    # - :api_key
  end
end
```

#### Role-based Permitted Attributes
```ruby
def user_params
  permitted_attrs = [:name, :email, :password]
  
  # Only admins can change roles
  permitted_attrs << :role if current_user.admin?
  
  params.require(:user).permit(permitted_attrs)
end

# Or use separate methods
def user_params
  if current_user.admin?
    admin_user_params
  else
    basic_user_params
  end
end

def basic_user_params
  params.require(:user).permit(:name, :email, :password)
end

def admin_user_params
  params.require(:user).permit(:name, :email, :password, :role, :status)
end
```

### 8. XSS Prevention

#### Automatic Escaping
```erb
<!-- Rails automatically escapes by default -->
<p><%= @user.bio %></p>  <!-- Safe -->

<!-- Don't use raw or html_safe unless absolutely necessary -->
<p><%= raw @user.bio %></p>  <!-- Dangerous -->
<p><%= @user.bio.html_safe %></p>  <!-- Dangerous -->
```

#### Sanitization
```ruby
# app/helpers/application_helper.rb
def sanitize_user_content(content)
  # Allow only safe HTML tags
  sanitize content, tags: %w[p br strong em a], 
                   attributes: %w[href]
end

# Or use more permissive settings
def sanitize_rich_content(content)
  sanitize content, 
    tags: %w[p br strong em ul ol li a img h1 h2 h3],
    attributes: %w[href src alt class]
end
```

#### Content Security Policy (CSP)
```ruby
# config/initializers/content_security_policy.rb
Rails.application.config.content_security_policy do |policy|
  policy.default_src :self
  policy.font_src    :self, :https
  policy.img_src     :self, :https, :data
  policy.object_src  :none
  policy.script_src  :self, :https
  policy.style_src   :self, :https
  
  # Disable inline scripts (prevents XSS)
  policy.script_src :self, :https
  
  # Report violations
  policy.report_uri "/csp-violation-report-endpoint"
end

# For development, you might want to be more permissive
if Rails.env.development?
  Rails.application.config.content_security_policy_nonce_generator = 
    -> request { SecureRandom.base64(16) }
end
```

### 9. Secure Headers

```ruby
# Gemfile
gem 'secure_headers'

# config/initializers/secure_headers.rb
SecureHeaders::Configuration.default do |config|
  config.x_frame_options = "DENY"
  config.x_content_type_options = "nosniff"
  config.x_xss_protection = "1; mode=block"
  config.x_download_options = "noopen"
  config.x_permitted_cross_domain_policies = "none"
  config.referrer_policy = %w[origin-when-cross-origin strict-origin-when-cross-origin]
  
  config.csp = {
    default_src: %w['self'],
    font_src: %w['self' data: https:],
    img_src: %w['self' https: data:],
    object_src: %w['none'],
    script_src: %w['self'],
    style_src: %w['self' 'unsafe-inline' https:],
    connect_src: %w['self' wss: https:],
    base_uri: %w['self']
  }
  
  # HSTS (HTTP Strict Transport Security)
  config.hsts = "max-age=#{1.year.to_i}; includeSubDomains; preload"
end
```

### 10. Sensitive Data Protection

#### Credentials Management
```ruby
# Use Rails encrypted credentials
# rails credentials:edit

# config/credentials.yml.enc
aws:
  access_key_id: YOUR_ACCESS_KEY
  secret_access_key: YOUR_SECRET_KEY

stripe:
  publishable_key: pk_test_xxx
  secret_key: sk_test_xxx

# Access in code
Rails.application.credentials.aws[:access_key_id]
Rails.application.credentials.stripe[:secret_key]

# Never commit:
# - .env files with real credentials
# - config/master.key (add to .gitignore)
# - Any file with API keys or passwords
```

#### Attribute Encryption
```ruby
# Gemfile
gem 'attr_encrypted'

class User < ApplicationRecord
  attr_encrypted :ssn, key: Rails.application.credentials.encryption_key
  attr_encrypted :credit_card, key: Rails.application.credentials.encryption_key
  
  # Data is encrypted in database
  # But accessible as normal in code
  def display_ssn
    "***-**-#{ssn[-4..]}"
  end
end

# Using Rails 7 built-in encryption
class User < ApplicationRecord
  encrypts :ssn
  encrypts :credit_card
end
```

#### Sensitive Params Filtering
```ruby
# config/initializers/filter_parameter_logging.rb
Rails.application.config.filter_parameters += [
  :password,
  :password_confirmation,
  :ssn,
  :credit_card,
  :cvv,
  :api_key,
  :secret,
  :token,
  :private_key
]

# These parameters will show as [FILTERED] in logs
```

### 11. OAuth Security

#### State Parameter (CSRF Protection)
```ruby
class OauthController < ApplicationController
  def authorize
    # Generate and store random state
    state = SecureRandom.hex(32)
    session[:oauth_state] = state
    
    redirect_to oauth_provider_url(
      client_id: ENV['OAUTH_CLIENT_ID'],
      redirect_uri: callback_url,
      state: state,
      scope: 'email profile'
    ), allow_other_host: true
  end
  
  def callback
    # Verify state parameter
    if params[:state] != session[:oauth_state]
      redirect_to root_path, alert: 'Invalid OAuth state'
      return
    end
    
    # Clear state from session
    session.delete(:oauth_state)
    
    # Exchange code for token
    # ... rest of OAuth flow
  end
end
```

#### Secure Token Storage
```ruby
class OauthToken < ApplicationRecord
  belongs_to :user
  
  # Encrypt tokens before storing
  attr_encrypted :access_token, key: Rails.application.credentials.encryption_key
  attr_encrypted :refresh_token, key: Rails.application.credentials.encryption_key
  
  def expired?
    expires_at && expires_at < Time.current
  end
  
  def refresh!
    # Call OAuth provider to refresh token
    response = oauth_client.refresh_token(refresh_token)
    
    update!(
      access_token: response['access_token'],
      refresh_token: response['refresh_token'],
      expires_at: Time.current + response['expires_in'].seconds
    )
  end
end
```

### 12. Two-Factor Authentication Security

#### Backup Codes
```ruby
class User < ApplicationRecord
  def generate_backup_codes
    codes = 10.times.map { SecureRandom.hex(4) }
    
    # Store hashed versions
    self.backup_codes = codes.map { |code| BCrypt::Password.create(code) }
    save!
    
    # Return plain codes only once
    codes
  end
  
  def verify_backup_code(code)
    backup_codes.each_with_index do |hashed_code, index|
      if BCrypt::Password.new(hashed_code) == code
        # Remove used code
        backup_codes.delete_at(index)
        save!
        return true
      end
    end
    false
  end
end
```

#### TOTP Secret Protection
```ruby
class User < ApplicationRecord
  # Never store TOTP secret in plain text
  attr_encrypted :otp_secret, key: Rails.application.credentials.encryption_key
  
  def enable_two_factor!
    self.otp_secret = ROTP::Base32.random
    self.otp_enabled = true
    save!
  end
  
  def verify_otp(code)
    totp = ROTP::TOTP.new(otp_secret)
    
    # Allow for time drift (30 seconds before/after)
    totp.verify(code, drift_behind: 30, drift_ahead: 30)
  end
end
```

### 13. Audit Logging

```ruby
class AuditLog < ApplicationRecord
  belongs_to :user, optional: true
  
  # Log security-relevant events
  def self.log_event(event_type, user: nil, details: {})
    create!(
      event_type: event_type,
      user: user,
      ip_address: details[:ip],
      user_agent: details[:user_agent],
      metadata: details[:metadata]
    )
  end
end

# Controller usage
class SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      # Log successful login
      AuditLog.log_event(
        'user_login',
        user: user,
        details: {
          ip: request.remote_ip,
          user_agent: request.user_agent
        }
      )
      
      session[:user_id] = user.id
      redirect_to dashboard_path
    else
      # Log failed login attempt
      AuditLog.log_event(
        'failed_login',
        details: {
          email: params[:email],
          ip: request.remote_ip,
          user_agent: request.user_agent
        }
      )
      
      flash.now[:alert] = "Invalid credentials"
      render :new
    end
  end
end
```

---

## Common Interview Questions

### Conceptual Questions

**Q: What's the difference between authentication and authorization?**

A: 
- **Authentication** verifies WHO you are (login, identity verification)
- **Authorization** determines WHAT you can do (permissions, access control)

Example: Authentication confirms you're John. Authorization determines if John can delete users.

---

**Q: Explain how password hashing works and why we use it.**

A: Password hashing converts passwords into irreversible strings using algorithms like BCrypt.

**Why BCrypt?**
- **One-way function**: Can't reverse hash to get original password
- **Salting**: Adds random data to prevent rainbow table attacks
- **Adaptive**: Configurable work factor makes it slower as hardware improves
- **Timing attack resistant**: Comparison takes constant time

```ruby
# BCrypt process:
# 1. Generate random salt: "$2a$12$K4E4cV7u..."
# 2. Combine password + salt
# 3. Hash multiple times (work factor of 12 = 2^12 iterations)
# 4. Store: "$2a$12$salt$hash"

# Verification:
# 1. Extract salt from stored hash
# 2. Hash provided password with same salt
# 3. Compare hashes in constant time
```

**Never do:**
- Store plain text passwords
- Use MD5 or SHA1 (too fast, no salt)
- Use same salt for all users

---

**Q: How do JWT tokens work and when should you use them?**

A: JWT (JSON Web Token) is a compact, self-contained token for stateless authentication.

**Structure:**
```
header.payload.signature

# Example:
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.signature
```

**When to use JWT:**
- ✅ Stateless APIs
- ✅ Microservices
- ✅ Mobile apps
- ✅ Single-page applications
- ✅ Cross-domain authentication

**When NOT to use JWT:**
- ❌ Traditional web apps (use sessions)
- ❌ Need immediate revocation (unless implementing blacklist)
- ❌ Storing large amounts of data (tokens get big)

**Security considerations:**
- Short expiration times (15-30 minutes)
- Use refresh tokens for extended sessions
- Implement token blacklist for logout
- Store securely (httpOnly cookies or secure storage)

---

**Q: What's the difference between cookie-based and token-based authentication?**

A: 

**Cookie-based (Session):**
```ruby
# Server stores session data
Session ID: "abc123" → { user_id: 1, role: 'admin' }

# Pros:
- Easy revocation (delete server session)
- Less data sent with each request
- Built-in CSRF protection

# Cons:
- Requires server-side storage
- Difficult to scale horizontally
- Doesn't work well with mobile apps
```

**Token-based (JWT):**
```ruby
# Token contains all data
Token: { user_id: 1, role: 'admin', exp: 1234567890 }

# Pros:
- Stateless (no server storage)
- Easy horizontal scaling
- Works everywhere (web, mobile, APIs)

# Cons:
- Harder to revoke immediately
- Larger payload size
- Needs manual CSRF protection
```

**Hybrid approach:**
```ruby
# Use refresh tokens + access tokens
# - Short-lived access token (15 min)
# - Long-lived refresh token (30 days) stored server-side
# - Best of both worlds
```

---

**Q: How would you implement role-based access control?**

A: Multiple approaches depending on complexity:

**1. Simple Enum (Basic):**
```ruby
class User < ApplicationRecord
  enum role: { user: 0, moderator: 1, admin: 2 }
  
  def can_delete_posts?
    admin? || moderator?
  end
end
```

**2. Pundit (Recommended for medium complexity):**
```ruby
class PostPolicy < ApplicationPolicy
  def destroy?
    user.admin? || record.user == user
  end
  
  class Scope < Scope
    def resolve
      if user.admin?
        scope.all
      else
        scope.where(published: true)
      end
    end
  end
end
```

**3. CanCanCan (Good for complex permissions):**
```ruby
class Ability
  include CanCan::Ability
  
  def initialize(user)
    if user.admin?
      can :manage, :all
    elsif user.moderator?
      can :manage, Post
      cannot :destroy, User
    else
      can :read, Post, published: true
      can :manage, Post, user_id: user.id
    end
  end
end
```

**4. Custom RBAC with Permissions:**
```ruby
# Many-to-many: Users → Roles → Permissions
class User < ApplicationRecord
  has_many :user_roles
  has_many :roles, through: :user_roles
  
  def can?(permission_name)
    roles.joins(:permissions)
         .exists?(permissions: { name: permission_name })
  end
end

# Usage
current_user.can?('delete_posts')
```

---

**Q: Explain CSRF attacks and how Rails protects against them.**

A: **Cross-Site Request Forgery (CSRF)** tricks users into performing unwanted actions.

**Attack scenario:**
```html
<!-- Malicious site -->
<img src="https://yourbank.com/transfer?to=hacker&amount=1000">

<!-- If user is logged in to yourbank.com, this executes -->
```

**Rails protection:**
```ruby
# 1. Generates unique token per session
# 2. Embeds in forms automatically
<form>
  <input type="hidden" 
         name="authenticity_token" 
         value="xyz789..." />
</form>

# 3.
```

