# Rails Security Best Practices

## Table of Contents
- [CSRF Protection](#csrf-protection)
- [SQL Injection Prevention](#sql-injection-prevention)
- [XSS (Cross-Site Scripting) Prevention](#xss-cross-site-scripting-prevention)
- [Mass Assignment Protection](#mass-assignment-protection)
- [Authentication Security](#authentication-security)
- [Session Management](#session-management)
- [Secure Headers](#secure-headers)
- [File Upload Security](#file-upload-security)
- [Rate Limiting & Throttling](#rate-limiting--throttling)
- [Dependency Management](#dependency-management)
- [API Security](#api-security)
- [Environment & Configuration Security](#environment--configuration-security)

---

## CSRF Protection

### What is CSRF?
Cross-Site Request Forgery is an attack where a malicious website tricks a user's browser into making unwanted requests to your application using the user's authenticated session.

### Rails Protection Mechanism
```ruby
class ApplicationController < ActionController::Base
  # Enabled by default in Rails
  protect_from_forgery with: :exception
  
  # Alternative strategies:
  # protect_from_forgery with: :null_session  # Clears session instead of raising exception
  # protect_from_forgery with: :reset_session  # Resets the entire session
end
```

### Key Points
- Rails automatically includes CSRF tokens in forms generated with `form_with` or `form_for`
- Token is stored in session and verified on POST, PUT, PATCH, DELETE requests
- For AJAX requests, token is automatically included via meta tag and Rails UJS

```erb
<!-- Automatically included in layout -->
<%= csrf_meta_tags %>
```

```javascript
// Rails UJS automatically includes this in AJAX requests
// Token from meta tag: document.querySelector('meta[name="csrf-token"]').content
```

### API Considerations
```ruby
class Api::BaseController < ActionController::API
  # Skip CSRF for stateless API with token authentication
  skip_before_action :verify_authenticity_token
end
```

### Interview Questions
- **Q: When would you skip CSRF protection?**
  - A: For stateless APIs using token-based authentication (JWT, API keys), as there's no session cookie to exploit

- **Q: What happens if CSRF token verification fails?**
  - A: Depends on strategy - `:exception` raises `ActionController::InvalidAuthenticityToken`, `:null_session` clears session

---

## SQL Injection Prevention

### What is SQL Injection?
An attack where malicious SQL code is inserted into query parameters, potentially exposing or manipulating database data.

### Always Use Parameterized Queries

#### ❌ UNSAFE - Never do this
```ruby
# Direct string interpolation - VULNERABLE!
User.where("email = '#{params[:email]}'")
User.where("name LIKE '%#{params[:search]}%'")

# SQL fragment without binding
User.where("created_at > '#{params[:date]}'")
```

#### ✅ SAFE - Use these patterns
```ruby
# Placeholder syntax (recommended)
User.where("email = ?", params[:email])
User.where("name LIKE ?", "%#{params[:search]}%")

# Named placeholders
User.where("email = :email AND active = :active", 
           email: params[:email], active: true)

# Hash conditions (safest for simple queries)
User.where(email: params[:email], active: true)

# Arel (for complex queries)
users = User.arel_table
User.where(users[:email].eq(params[:email]))
```

### Sanitization Methods
```ruby
# Sanitize SQL
ActiveRecord::Base.sanitize_sql_array(["name = ?", params[:name]])

# Sanitize for LIKE
User.where("name LIKE ?", "%#{ActiveRecord::Base.sanitize_sql_like(params[:search])}%")

# Quote values
ActiveRecord::Base.connection.quote(params[:value])
```

### Dynamic Column Names
```ruby
# ❌ UNSAFE
User.order("#{params[:sort_by]} #{params[:direction]}")

# ✅ SAFE - Whitelist approach
ALLOWED_SORT_COLUMNS = %w[name email created_at].freeze
ALLOWED_DIRECTIONS = %w[asc desc].freeze

sort_column = ALLOWED_SORT_COLUMNS.include?(params[:sort_by]) ? params[:sort_by] : 'created_at'
direction = ALLOWED_DIRECTIONS.include?(params[:direction]) ? params[:direction] : 'asc'

User.order("#{sort_column} #{direction}")
```

### Interview Questions
- **Q: Why is `User.where("email = '#{email}'")` dangerous?**
  - A: Allows SQL injection - attacker could input `' OR '1'='1` to bypass authentication or access all records

- **Q: What's the difference between `?` and named placeholders?**
  - A: `?` uses positional binding, named placeholders (`:name`) are more readable for complex queries with multiple parameters

---

## XSS (Cross-Site Scripting) Prevention

### What is XSS?
Attack where malicious JavaScript is injected into web pages, executing in other users' browsers to steal data or perform actions.

### Rails Auto-Escaping
```erb
<!-- Automatically HTML-escaped -->
<p><%= @user.bio %></p>
<!-- If bio contains <script>, it renders as &lt;script&gt; -->

<!-- Explicitly mark as safe (USE WITH CAUTION) -->
<%= raw @user.bio %>
<%= @user.bio.html_safe %>

<!-- Sanitize HTML while allowing safe tags -->
<%= sanitize @user.bio, tags: %w[p br strong em], attributes: %w[href] %>
```

### Content Security Policy (CSP)
```ruby
# config/initializers/content_security_policy.rb
Rails.application.config.content_security_policy do |policy|
  policy.default_src :self, :https
  policy.font_src    :self, :https, :data
  policy.img_src     :self, :https, :data
  policy.object_src  :none
  policy.script_src  :self, :https
  policy.style_src   :self, :https
  
  # Specify nonce for inline scripts
  # policy.script_src :self, :https, :unsafe_inline if Rails.env.development?
end

# Enable nonce-based inline script protection
Rails.application.config.content_security_policy_nonce_generator = 
  ->(request) { SecureRandom.base64(16) }
```

### JavaScript Context
```javascript
// ❌ UNSAFE - DOM-based XSS
document.getElementById('output').innerHTML = userInput;

// ✅ SAFE
document.getElementById('output').textContent = userInput;

// For JSON data
<script>
  var userData = <%= raw @user.to_json %>;  // JSON is safe
  // But never: var userBio = "<%= raw @user.bio %>";
</script>
```

### Sanitization Helpers
```ruby
# In controllers or helpers
def sanitize_user_input(text)
  ActionController::Base.helpers.sanitize(text, 
    tags: %w[p br strong em a],
    attributes: %w[href])
end

# Strip all HTML tags
ActionController::Base.helpers.strip_tags(html_string)

# For URLs
url_encode(user_input)
```

### Interview Questions
- **Q: When should you use `html_safe`?**
  - A: Only when you've explicitly sanitized content or when rendering trusted HTML from your own code, never on raw user input

- **Q: What's the difference between XSS and CSRF?**
  - A: XSS injects malicious scripts into pages (affects other users), CSRF tricks users into making unwanted requests (affects the user themselves)

---

## Mass Assignment Protection

### What is Mass Assignment?
Vulnerability where attackers can modify unintended model attributes by adding extra parameters to requests.

### Strong Parameters (Rails 4+)
```ruby
class UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    # ...
  end
  
  def update
    @user = User.find(params[:id])
    @user.update(user_params)
    # ...
  end
  
  private
  
  # Whitelist allowed attributes
  def user_params
    params.require(:user).permit(:name, :email, :bio)
  end
end
```

### Advanced Strong Parameters
```ruby
# Nested attributes
def post_params
  params.require(:post).permit(
    :title, 
    :body,
    :category_id,
    tag_ids: [],
    comments_attributes: [:id, :body, :_destroy]
  )
end

# Conditional permissions
def user_params
  if current_user.admin?
    params.require(:user).permit(:name, :email, :role, :admin)
  else
    params.require(:user).permit(:name, :email)
  end
end

# Using slice for explicit control
def user_params
  params.require(:user).slice(:name, :email, :bio)
end
```

### Model-Level Protection (Legacy)
```ruby
# Old Rails 3 approach - avoid in modern apps
class User < ApplicationRecord
  attr_accessible :name, :email  # Whitelist
  attr_protected :admin          # Blacklist
end
```

### Preventing Over-Posting
```ruby
# ❌ BAD - Allows any attribute
User.create(params[:user])

# ❌ BAD - Bypasses strong parameters
@user.attributes = params[:user]

# ✅ GOOD
@user.update(user_params)

# ✅ GOOD - For specific attributes
@user.update_columns(last_login: Time.current)  # Skips validations & callbacks
@user.update_column(:login_count, @user.login_count + 1)
```

### Interview Questions
- **Q: What's the risk of not using strong parameters?**
  - A: Users could set `admin: true` or modify `user_id` to escalate privileges or access others' data

- **Q: How do you handle different permissions for different user roles?**
  - A: Use conditional logic in strong parameter methods based on `current_user` role or abilities

---

## Authentication Security

### Password Security
```ruby
# Rails uses bcrypt by default with has_secure_password
class User < ApplicationRecord
  has_secure_password
  
  # Minimum requirements
  validates :password, length: { minimum: 12 }, if: -> { new_record? || !password.nil? }
  validates :password, format: { 
    with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    message: "must include uppercase, lowercase, number, and special character"
  }, if: -> { !password.nil? }
end
```

### Devise Security Configuration
```ruby
# config/initializers/devise.rb
Devise.setup do |config|
  # Strong password requirements
  config.password_length = 12..128
  
  # Lock account after failed attempts
  config.lock_strategy = :failed_attempts
  config.unlock_strategy = :time
  config.maximum_attempts = 5
  config.unlock_in = 1.hour
  
  # Expire sessions
  config.timeout_in = 30.minutes
  
  # Paranoid mode (don't reveal if email exists)
  config.paranoid = true
  
  # Require email confirmation
  config.reconfirmable = true
  
  # Pepper for additional password encryption
  config.pepper = ENV['DEVISE_PEPPER']
  
  # Strong token generation
  config.stretches = Rails.env.test? ? 1 : 12
end
```

### Two-Factor Authentication (2FA)
```ruby
# Using devise-two-factor gem
class User < ApplicationRecord
  devise :two_factor_authenticatable, 
         :otp_secret_encryption_key => ENV['OTP_SECRET_KEY']
  
  # Generate QR code for TOTP apps
  def provisioning_uri(email)
    otp_provisioning_uri(email, issuer: 'YourApp')
  end
  
  # Backup codes
  def generate_backup_codes
    codes = 10.times.map { SecureRandom.hex(4) }
    self.backup_codes = codes.map { |code| Digest::SHA256.hexdigest(code) }
    codes  # Return unhashed codes to show user once
  end
end
```

### OAuth Security
```ruby
# Store state parameter to prevent CSRF
class OauthController < ApplicationController
  def authorize
    state = SecureRandom.hex(24)
    session[:oauth_state] = state
    
    redirect_to oauth_provider.authorize_url(
      redirect_uri: callback_url,
      state: state,
      scope: 'email profile'
    ), allow_other_host: true
  end
  
  def callback
    # Verify state parameter
    if params[:state] != session[:oauth_state]
      return redirect_to root_path, alert: 'Invalid OAuth state'
    end
    
    # Exchange code for token
    token = oauth_provider.get_token(params[:code])
    # ...
  end
end
```

### Token-Based Authentication
```ruby
# JWT implementation
class JsonWebToken
  SECRET_KEY = Rails.application.credentials.secret_key_base
  
  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end
  
  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })[0]
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::DecodeError, JWT::ExpiredSignature
    nil
  end
end

# Usage in controller
class ApplicationController < ActionController::API
  before_action :authenticate_request
  
  private
  
  def authenticate_request
    header = request.headers['Authorization']
    token = header.split(' ').last if header
    
    decoded = JsonWebToken.decode(token)
    @current_user = User.find(decoded[:user_id]) if decoded
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end
end
```

### Interview Questions
- **Q: How does `has_secure_password` work?**
  - A: Uses bcrypt to hash passwords with salt, stores in `password_digest` column, provides authentication methods

- **Q: What's the difference between encryption and hashing for passwords?**
  - A: Encryption is reversible (not suitable for passwords), hashing is one-way (can't recover original password)

- **Q: How would you implement "remember me" functionality securely?**
  - A: Use secure random token stored in database, set long-lived cookie with HttpOnly/Secure flags, rotate token on each use

---

## Session Management

### Session Configuration
```ruby
# config/initializers/session_store.rb
Rails.application.config.session_store :cookie_store,
  key: '_your_app_session',
  secure: Rails.env.production?,  # HTTPS only in production
  httponly: true,                 # Not accessible via JavaScript
  same_site: :lax,                # CSRF protection
  expire_after: 2.hours

# For sensitive apps, use database sessions
# Rails.application.config.session_store :active_record_store
```

### Session Security Best Practices
```ruby
class ApplicationController < ActionController::Base
  # Reset session on login/logout to prevent fixation
  def create_session(user)
    reset_session  # Important!
    session[:user_id] = user.id
    session[:created_at] = Time.current
  end
  
  def destroy_session
    reset_session
  end
  
  # Session timeout check
  before_action :check_session_expiry
  
  private
  
  def check_session_expiry
    if session[:created_at] && session[:created_at] < 2.hours.ago
      reset_session
      redirect_to login_path, alert: 'Session expired'
    else
      session[:created_at] = Time.current
    end
  end
end
```

### Sensitive Data in Sessions
```ruby
# ❌ DON'T store sensitive data in sessions
session[:credit_card] = params[:cc_number]  # BAD!
session[:password] = params[:password]       # BAD!

# ✅ DO store minimal identifiers
session[:user_id] = user.id
session[:cart_id] = cart.id

# For temporary sensitive data, use encrypted credentials
Rails.application.credentials.dig(:api_keys, :stripe)
```

### Session Fixation Prevention
```ruby
# Rails resets session ID automatically on authentication
# But explicitly reset for additional security
def login
  user = User.authenticate(params[:email], params[:password])
  if user
    reset_session  # Prevents session fixation
    session[:user_id] = user.id
    redirect_to dashboard_path
  end
end
```

### Interview Questions
- **Q: What is session fixation?**
  - A: Attack where attacker sets a user's session ID before login, then hijacks the authenticated session

- **Q: Why use `httponly` flag for session cookies?**
  - A: Prevents JavaScript from accessing cookies, mitigating XSS attacks that try to steal session tokens

- **Q: When would you use database sessions instead of cookie sessions?**
  - A: For sensitive applications, to store more data, for better control over session invalidation, or to track active sessions

---

## Secure Headers

### Using secure_headers Gem
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
    script_src: %w['self' 'unsafe-inline'],  # Avoid unsafe-inline in production
    style_src: %w['self' 'unsafe-inline'],
    img_src: %w['self' data: https:],
    font_src: %w['self' data:],
    connect_src: %w['self'],
    frame_ancestors: %w['none']
  }
end
```

### Manual Header Configuration
```ruby
# config/application.rb
config.action_dispatch.default_headers = {
  'X-Frame-Options' => 'DENY',
  'X-Content-Type-Options' => 'nosniff',
  'X-XSS-Protection' => '1; mode=block',
  'Referrer-Policy' => 'strict-origin-when-cross-origin'
}

# In controller for specific actions
class ApplicationController < ActionController::Base
  after_action :set_security_headers
  
  private
  
  def set_security_headers
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
  end
end
```

### HSTS (HTTP Strict Transport Security)
```ruby
# config/environments/production.rb
config.force_ssl = true  # Enables HSTS automatically

# Or manually
config.ssl_options = {
  hsts: {
    expires: 1.year.to_i,
    subdomains: true,
    preload: true
  }
}
```

### Understanding Key Headers
```
X-Frame-Options: DENY
  → Prevents clickjacking by disallowing page rendering in frames

X-Content-Type-Options: nosniff
  → Prevents MIME-sniffing attacks

X-XSS-Protection: 1; mode=block
  → Enables browser XSS filtering (legacy, CSP is better)

Strict-Transport-Security: max-age=31536000; includeSubDomains
  → Forces HTTPS for specified duration

Referrer-Policy: strict-origin-when-cross-origin
  → Controls referrer information sent with requests
```

### Interview Questions
- **Q: What's the purpose of X-Frame-Options?**
  - A: Prevents clickjacking by controlling whether the page can be embedded in frames/iframes

- **Q: Why use HSTS?**
  - A: Forces browsers to only connect via HTTPS, preventing protocol downgrade attacks

---

## File Upload Security

### Validation
```ruby
class Document < ApplicationRecord
  # Using ActiveStorage
  has_one_attached :file
  
  validate :acceptable_file
  
  private
  
  def acceptable_file
    return unless file.attached?
    
    # Check file size
    unless file.byte_size <= 10.megabytes
      errors.add(:file, "is too large (max 10MB)")
    end
    
    # Check content type
    acceptable_types = %w[image/jpeg image/png application/pdf]
    unless acceptable_types.include?(file.content_type)
      errors.add(:file, "must be JPEG, PNG, or PDF")
    end
  end
end
```

### Content Type Verification
```ruby
# Don't trust client-provided MIME types
class FileUploadService
  ALLOWED_TYPES = {
    'image/jpeg' => [0xFF, 0xD8, 0xFF],
    'image/png' => [0x89, 0x50, 0x4E, 0x47],
    'application/pdf' => [0x25, 0x50, 0x44, 0x46]
  }.freeze
  
  def self.verify_file_type(file)
    header = File.binread(file.path, 4).unpack('C*')
    
    ALLOWED_TYPES.any? do |mime, signature|
      header[0...signature.length] == signature
    end
  end
end

# Usage
validate :verify_file_signature

def verify_file_signature
  return unless file.attached?
  
  unless FileUploadService.verify_file_type(file)
    errors.add(:file, "appears to be corrupted or invalid")
  end
end
```

### Secure File Storage
```ruby
# config/storage.yml - Use cloud storage in production
amazon:
  service: S3
  access_key_id: <%= ENV['AWS_ACCESS_KEY_ID'] %>
  secret_access_key: <%= ENV['AWS_SECRET_ACCESS_KEY'] %>
  region: us-east-1
  bucket: your-bucket
  
# Serve files through application (not directly)
class DocumentsController < ApplicationController
  def download
    document = Document.find(params[:id])
    
    # Authorization check
    authorize document
    
    # Stream file instead of redirect (hides actual URL)
    send_data document.file.download,
              filename: document.file.filename.to_s,
              type: document.file.content_type,
              disposition: 'attachment'
  end
end
```

### Filename Sanitization
```ruby
class FileUploadService
  def self.sanitize_filename(filename)
    # Remove path information
    basename = File.basename(filename)
    
    # Remove non-alphanumeric characters except dots and hyphens
    basename.gsub(/[^\w\.\-]/, '_')
  end
end

# Usage in model
before_save :sanitize_file_name

def sanitize_file_name
  return unless file.attached?
  
  original_name = file.filename.to_s
  sanitized = FileUploadService.sanitize_filename(original_name)
  
  file.blob.update(filename: sanitized) if original_name != sanitized
end
```

### Preventing Directory Traversal
```ruby
# ❌ UNSAFE
def show_file
  filename = params[:filename]
  send_file "#{Rails.root}/uploads/#{filename}"  # Can access ../../../etc/passwd
end

# ✅ SAFE
def show_file
  filename = File.basename(params[:filename])  # Removes path components
  safe_path = Rails.root.join('uploads', filename)
  
  # Verify path is within allowed directory
  unless safe_path.to_s.start_with?(Rails.root.join('uploads').to_s)
    return head :forbidden
  end
  
  send_file safe_path if File.exist?(safe_path)
end
```

### Image Processing Security
```ruby
# Using ImageProcessing gem with libvips (more secure than ImageMagick)
class User < ApplicationRecord
  has_one_attached :avatar
  
  def thumbnail
    avatar.variant(
      resize_to_limit: [200, 200],
      saver: { strip: true }  # Remove EXIF data
    )
  end
end

# Scan for malware (example with ClamAV)
class AntivirusValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    return unless value.attached?
    
    temp_file = value.download
    result = system("clamscan --no-summary #{temp_file.path}")
    
    unless result
      record.errors.add(attribute, "contains malware")
    end
  ensure
    temp_file.close! if temp_file
  end
end
```

### Interview Questions
- **Q: Why not trust client-provided MIME types?**
  - A: Easily spoofed - attackers can upload malicious files with fake extensions/MIME types. Check magic bytes instead.

- **Q: What's the risk of serving uploaded files directly from the filesystem?**
  - A: Directory traversal attacks, executing uploaded scripts, bypassing authorization checks

---

## Rate Limiting & Throttling

### Rack Attack Gem
```ruby
# Gemfile
gem 'rack-attack'

# config/initializers/rack_attack.rb
class Rack::Attack
  # Throttle login attempts
  throttle('logins/ip', limit: 5, period: 20.seconds) do |req|
    if req.path == '/login' && req.post?
      req.ip
    end
  end
  
  # Throttle by email parameter
  throttle('logins/email', limit: 5, period: 20.seconds) do |req|
    if req.path == '/login' && req.post?
      req.params['email'].to_s.downcase.presence
    end
  end
  
  # Throttle API calls
  throttle('api/ip', limit: 100, period: 1.hour) do |req|
    req.ip if req.path.start_with?('/api/')
  end
  
  # Throttle by API key
  throttle('api/key', limit: 1000, period: 1.hour) do |req|
    req.env['HTTP_AUTHORIZATION'] if req.path.start_with?('/api/')
  end
  
  # Block specific IPs
  blocklist('block bad actors') do |req|
    Rails.cache.read("block_ip:#{req.ip}")
  end
  
  # Safelist trusted IPs
  safelist('allow from localhost') do |req|
    '127.0.0.1' == req.ip || '::1' == req.ip
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
      [{ error: 'Rate limit exceeded. Try again later.' }.to_json]
    ]
  end
end

# Enable in environment
# config/environments/production.rb
config.middleware.use Rack::Attack
```

### Redis-Based Rate Limiting
```ruby
class RateLimiter
  def self.check(key, limit:, period:)
    count = Redis.current.incr(key)
    Redis.current.expire(key, period) if count == 1
    
    count <= limit
  end
  
  def self.reset(key)
    Redis.current.del(key)
  end
end

# Usage in controller
class ApiController < ApplicationController
  before_action :check_rate_limit
  
  private
  
  def check_rate_limit
    key = "rate_limit:#{current_user.id}:#{controller_name}"
    
    unless RateLimiter.check(key, limit: 100, period: 1.hour)
      render json: { error: 'Rate limit exceeded' }, status: :too_many_requests
    end
  end
end
```

### Progressive Rate Limiting
```ruby
# Increase limits for verified users
throttle('api/ip', limit: ->(req) {
  user = User.find_by(api_key: req.env['HTTP_AUTHORIZATION'])
  user&.verified? ? 10000 : 100
}, period: 1.hour) do |req|
  req.ip if req.path.start_with?('/api/')
end
```

### Exponential Backoff for Failed Attempts
```ruby
class LoginAttemptService
  def self.record_failure(email)
    key = "login_attempts:#{email}"
    attempts = Redis.current.incr(key)
    Redis.current.expire(key, backoff_period(attempts))
    attempts
  end
  
  def self.locked?(email)
    attempts = Redis.current.get("login_attempts:#{email}").to_i
    attempts >= 5
  end
  
  def self.backoff_period(attempts)
    return 1.minute if attempts < 3
    return 10.minutes if attempts < 5
    1.hour
  end
  
  def self.reset(email)
    Redis.current.del("login_attempts:#{email}")
  end
end
```

### Interview Questions
- **Q: Why rate limit by both IP and user identifier?**
  - A: IP can be shared (NAT) or spoofed, user identifier can be distributed across IPs. Both provide defense in depth.

- **Q: How do you handle rate limiting in a distributed system?**
  - A: Use centralized store like Redis, implement sliding window algorithms, consider using tools like Redis sorted sets

---

## Dependency Management

### Regular Updates
```bash
# Check for outdated gems
bundle outdated

# Update specific gem
bundle update gem_name

# Update all gems (with caution)
bundle update

# Check for security vulnerabilities
bundle audit --update
gem install bundler-audit
bundler-audit check
```

### Bundler Audit
```ruby
# Gemfile
group :development do
  gem 'bundler-audit', require: false
end

# Run in CI/CD
bundle exec bundle-audit check --update

# .github/workflows/security.yml
- name: Security audit
  run: |
    gem install bundler-audit
    bundle-audit check --update
```

### Specific Version Pinning
```ruby
# Gemfile - pin exact versions for critical gems
gem 'devise', '4.9.2'
gem 'pundit', '~> 2.3.0'  # Pessimistic version constraint

# Lock file ensures consistency
# Commit Gemfile.lock to version control
```

### Checking Gem Source Code
```bash
# Review gem source before using
bundle open gem_name

# Check gem's reputation
# - GitHub stars/contributors
# - Last update date
# - Issue count
# - Company/maintainer reputation
```

### Security Scanning Tools
```ruby
# Brakeman - static analysis for security vulnerabilities
group :development do
  gem 'brakeman', require: false
end

# Run scan
bundle exec brakeman -A -w2

# In CI/CD
bundle exec brakeman --no-pager --format json -o brakeman_results.json
```

### Interview Questions
- **Q: How often should you update dependencies?**
  - A: Regular schedule (weekly/monthly for minor, immediately for





