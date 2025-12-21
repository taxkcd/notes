# Third-Party Integrations

## Payment Integrations

### Stripe Integration

**Setup and Configuration**

```ruby
# Gemfile
gem 'stripe'

# config/initializers/stripe.rb
Stripe.api_key = ENV['STRIPE_SECRET_KEY']
Stripe.api_version = '2023-10-16'

# Configure webhook signing secret
STRIPE_WEBHOOK_SECRET = ENV['STRIPE_WEBHOOK_SECRET']
```

**Basic Charge Creation**

```ruby
class PaymentsController < ApplicationController
  def create
    customer = Stripe::Customer.create(
      email: params[:email],
      source: params[:stripeToken]
    )

    charge = Stripe::Charge.create(
      customer: customer.id,
      amount: calculate_amount,
      description: 'Product Purchase',
      currency: 'usd'
    )

    # Save payment record
    Payment.create!(
      user: current_user,
      stripe_charge_id: charge.id,
      amount: charge.amount,
      status: charge.status
    )

    redirect_to success_path
  rescue Stripe::CardError => e
    flash[:error] = e.message
    redirect_to checkout_path
  end
end
```

**Payment Intents (Recommended)**

```ruby
# Create payment intent
def create_payment_intent
  intent = Stripe::PaymentIntent.create(
    amount: 2000,
    currency: 'usd',
    customer: current_user.stripe_customer_id,
    payment_method_types: ['card'],
    metadata: {
      order_id: @order.id,
      user_id: current_user.id
    }
  )

  render json: { client_secret: intent.client_secret }
end

# Confirm payment
def confirm_payment
  intent = Stripe::PaymentIntent.retrieve(params[:payment_intent_id])
  
  if intent.status == 'succeeded'
    @order.update!(payment_status: 'paid')
    # Send confirmation email
  end
end
```

**Subscriptions**

```ruby
class SubscriptionsController < ApplicationController
  def create
    # Create or retrieve customer
    customer = find_or_create_stripe_customer(current_user)
    
    # Create subscription
    subscription = Stripe::Subscription.create(
      customer: customer.id,
      items: [{ price: params[:price_id] }],
      payment_behavior: 'default_incomplete',
      payment_settings: { 
        save_default_payment_method: 'on_subscription' 
      },
      expand: ['latest_invoice.payment_intent']
    )

    # Save subscription to database
    current_user.subscriptions.create!(
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customer.id,
      status: subscription.status,
      current_period_end: Time.at(subscription.current_period_end)
    )

    render json: {
      subscription_id: subscription.id,
      client_secret: subscription.latest_invoice.payment_intent.client_secret
    }
  end

  def cancel
    subscription = current_user.subscriptions.find(params[:id])
    
    Stripe::Subscription.update(
      subscription.stripe_subscription_id,
      cancel_at_period_end: true
    )
    
    subscription.update!(cancels_at: subscription.current_period_end)
  end

  private

  def find_or_create_stripe_customer(user)
    if user.stripe_customer_id.present?
      Stripe::Customer.retrieve(user.stripe_customer_id)
    else
      customer = Stripe::Customer.create(
        email: user.email,
        metadata: { user_id: user.id }
      )
      user.update!(stripe_customer_id: customer.id)
      customer
    end
  end
end
```

**Webhook Handling**

```ruby
class StripeWebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']

    begin
      event = Stripe::Webhook.construct_event(
        payload, sig_header, STRIPE_WEBHOOK_SECRET
      )
    rescue JSON::ParserError => e
      render json: { error: 'Invalid payload' }, status: 400
      return
    rescue Stripe::SignatureVerificationError => e
      render json: { error: 'Invalid signature' }, status: 400
      return
    end

    # Handle the event
    case event.type
    when 'payment_intent.succeeded'
      handle_payment_intent_succeeded(event.data.object)
    when 'payment_intent.payment_failed'
      handle_payment_failed(event.data.object)
    when 'customer.subscription.created'
      handle_subscription_created(event.data.object)
    when 'customer.subscription.updated'
      handle_subscription_updated(event.data.object)
    when 'customer.subscription.deleted'
      handle_subscription_deleted(event.data.object)
    when 'invoice.payment_succeeded'
      handle_invoice_payment_succeeded(event.data.object)
    when 'invoice.payment_failed'
      handle_invoice_payment_failed(event.data.object)
    end

    render json: { status: 'success' }
  end

  private

  def handle_payment_intent_succeeded(payment_intent)
    payment = Payment.find_by(stripe_payment_intent_id: payment_intent.id)
    payment&.update!(status: 'succeeded')
  end

  def handle_subscription_updated(subscription)
    sub = Subscription.find_by(stripe_subscription_id: subscription.id)
    sub&.update!(
      status: subscription.status,
      current_period_end: Time.at(subscription.current_period_end)
    )
  end

  def handle_invoice_payment_failed(invoice)
    subscription = Subscription.find_by(stripe_subscription_id: invoice.subscription)
    SubscriptionMailer.payment_failed(subscription).deliver_later
  end
end
```

**Refunds**

```ruby
def create_refund
  refund = Stripe::Refund.create(
    charge: params[:charge_id],
    amount: params[:amount], # Optional, full refund if not specified
    reason: 'requested_by_customer'
  )

  payment = Payment.find_by(stripe_charge_id: params[:charge_id])
  payment.update!(refunded: true, refund_id: refund.id)
end
```

### Chargebee Integration

**Setup**

```ruby
# Gemfile
gem 'chargebee'

# config/initializers/chargebee.rb
ChargeBee.configure(
  site: ENV['CHARGEBEE_SITE'],
  api_key: ENV['CHARGEBEE_API_KEY']
)
```

**Create Subscription**

```ruby
class ChargebeeSubscriptionsController < ApplicationController
  def create
    result = ChargeBee::Subscription.create(
      plan_id: params[:plan_id],
      customer: {
        email: current_user.email,
        first_name: current_user.first_name,
        last_name: current_user.last_name
      },
      billing_address: {
        first_name: params[:billing][:first_name],
        last_name: params[:billing][:last_name],
        line1: params[:billing][:address],
        city: params[:billing][:city],
        state: params[:billing][:state],
        zip: params[:billing][:zip],
        country: params[:billing][:country]
      }
    )

    subscription = result.subscription
    customer = result.customer
    
    current_user.update!(
      chargebee_customer_id: customer.id,
      chargebee_subscription_id: subscription.id
    )

    render json: { 
      hosted_page_url: result.hosted_page.url,
      subscription_id: subscription.id 
    }
  rescue ChargeBee::InvalidRequestError => e
    render json: { error: e.message }, status: 422
  end

  def update
    result = ChargeBee::Subscription.update(
      current_user.chargebee_subscription_id,
      plan_id: params[:new_plan_id],
      prorate: true,
      end_of_term: false
    )

    render json: { subscription: result.subscription }
  end

  def cancel
    result = ChargeBee::Subscription.cancel(
      current_user.chargebee_subscription_id,
      end_of_term: params[:end_of_term] || false
    )

    current_user.update!(subscription_status: 'cancelled')
    render json: { subscription: result.subscription }
  end
end
```

**Hosted Pages (Checkout)**

```ruby
def create_checkout_page
  result = ChargeBee::HostedPage.checkout_new(
    subscription: {
      plan_id: params[:plan_id]
    },
    customer: {
      email: current_user.email,
      first_name: current_user.first_name,
      last_name: current_user.last_name
    },
    embed: false,
    redirect_url: success_url
  )

  render json: { url: result.hosted_page.url }
end

def acknowledge_checkout
  result = ChargeBee::HostedPage.retrieve(params[:hosted_page_id])
  hosted_page = result.hosted_page

  if hosted_page.state == 'succeeded'
    # Extract subscription and customer details
    subscription = hosted_page.content.subscription
    customer = hosted_page.content.customer

    current_user.update!(
      chargebee_customer_id: customer.id,
      chargebee_subscription_id: subscription.id,
      subscription_status: subscription.status
    )
  end
end
```

**Webhook Handling**

```ruby
class ChargebeeWebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    event = JSON.parse(request.body.read)

    case event['event_type']
    when 'subscription_created'
      handle_subscription_created(event['content'])
    when 'subscription_cancelled'
      handle_subscription_cancelled(event['content'])
    when 'subscription_renewed'
      handle_subscription_renewed(event['content'])
    when 'payment_succeeded'
      handle_payment_succeeded(event['content'])
    when 'payment_failed'
      handle_payment_failed(event['content'])
    end

    render json: { status: 'success' }
  end

  private

  def handle_subscription_cancelled(content)
    subscription = content['subscription']
    user = User.find_by(chargebee_subscription_id: subscription['id'])
    user&.update!(subscription_status: 'cancelled')
    SubscriptionMailer.cancellation_confirmed(user).deliver_later
  end

  def handle_payment_failed(content)
    subscription = content['subscription']
    user = User.find_by(chargebee_subscription_id: subscription['id'])
    SubscriptionMailer.payment_failed(user).deliver_later
  end
end
```

**Retrieve Customer and Invoices**

```ruby
# Get customer details
def customer_details
  result = ChargeBee::Customer.retrieve(current_user.chargebee_customer_id)
  customer = result.customer
  
  render json: { customer: customer }
end

# List invoices
def invoices
  result = ChargeBee::Invoice.list(
    limit: 20,
    'customer_id[is]': current_user.chargebee_customer_id,
    'sort_by[desc]': 'date'
  )

  invoices = result.map(&:invoice)
  render json: { invoices: invoices }
end

# Download invoice PDF
def download_invoice
  result = ChargeBee::Invoice.pdf(params[:invoice_id])
  
  send_data result.download.download_url,
            type: 'application/pdf',
            disposition: 'attachment',
            filename: "invoice_#{params[:invoice_id]}.pdf"
end
```

## Calendar Integrations

### Google Calendar Integration

**OAuth Setup**

```ruby
# Gemfile
gem 'google-api-client'

# config/initializers/google_calendar.rb
Google::Apis::RequestOptions.default.retries = 3

GOOGLE_CLIENT_ID = ENV['GOOGLE_CLIENT_ID']
GOOGLE_CLIENT_SECRET = ENV['GOOGLE_CLIENT_SECRET']
GOOGLE_REDIRECT_URI = ENV['GOOGLE_REDIRECT_URI']
```

**OAuth Flow**

```ruby
class GoogleCalendarAuthController < ApplicationController
  def authorize
    client = Signet::OAuth2::Client.new(
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      authorization_uri: 'https://accounts.google.com/o/oauth2/auth',
      scope: Google::Apis::CalendarV3::AUTH_CALENDAR,
      redirect_uri: GOOGLE_REDIRECT_URI
    )

    redirect_to client.authorization_uri.to_s, allow_other_host: true
  end

  def callback
    client = Signet::OAuth2::Client.new(
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      token_credential_uri: 'https://oauth2.googleapis.com/token',
      redirect_uri: GOOGLE_REDIRECT_URI,
      code: params[:code]
    )

    client.fetch_access_token!

    current_user.update!(
      google_access_token: client.access_token,
      google_refresh_token: client.refresh_token,
      google_token_expires_at: Time.at(client.expires_at)
    )

    redirect_to calendars_path, notice: 'Google Calendar connected!'
  end
end
```

**Calendar Service Wrapper**

```ruby
class GoogleCalendarService
  def initialize(user)
    @user = user
    @service = Google::Apis::CalendarV3::CalendarService.new
    @service.authorization = authorize_client
  end

  def list_events(calendar_id = 'primary', time_min: Time.now, time_max: 1.week.from_now)
    @service.list_events(
      calendar_id,
      time_min: time_min.iso8601,
      time_max: time_max.iso8601,
      single_events: true,
      order_by: 'startTime'
    )
  rescue Google::Apis::AuthorizationError => e
    refresh_token
    retry
  end

  def create_event(calendar_id = 'primary', event_params)
    event = Google::Apis::CalendarV3::Event.new(
      summary: event_params[:summary],
      description: event_params[:description],
      start: {
        date_time: event_params[:start_time].iso8601,
        time_zone: event_params[:time_zone] || 'UTC'
      },
      end: {
        date_time: event_params[:end_time].iso8601,
        time_zone: event_params[:time_zone] || 'UTC'
      },
      attendees: event_params[:attendees]&.map { |email| { email: email } },
      reminders: {
        use_default: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    )

    @service.insert_event(calendar_id, event, send_notifications: true)
  end

  def update_event(calendar_id = 'primary', event_id, event_params)
    event = @service.get_event(calendar_id, event_id)
    
    event.summary = event_params[:summary] if event_params[:summary]
    event.description = event_params[:description] if event_params[:description]
    
    if event_params[:start_time]
      event.start.date_time = event_params[:start_time].iso8601
    end
    
    if event_params[:end_time]
      event.end.date_time = event_params[:end_time].iso8601
    end

    @service.update_event(calendar_id, event_id, event, send_notifications: true)
  end

  def delete_event(calendar_id = 'primary', event_id)
    @service.delete_event(calendar_id, event_id, send_notifications: true)
  end

  def list_calendars
    @service.list_calendar_lists
  end

  private

  def authorize_client
    client = Signet::OAuth2::Client.new(
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      token_credential_uri: 'https://oauth2.googleapis.com/token',
      access_token: @user.google_access_token,
      refresh_token: @user.google_refresh_token,
      expires_at: @user.google_token_expires_at.to_i
    )

    client.refresh! if client.expired?
    client
  end

  def refresh_token
    client = authorize_client
    client.refresh!
    
    @user.update!(
      google_access_token: client.access_token,
      google_token_expires_at: Time.at(client.expires_at)
    )
    
    @service.authorization = client
  end
end
```

**Usage in Controllers**

```ruby
class CalendarEventsController < ApplicationController
  def index
    service = GoogleCalendarService.new(current_user)
    @events = service.list_events(
      time_min: params[:start_date] || Time.now,
      time_max: params[:end_date] || 1.month.from_now
    )
  end

  def create
    service = GoogleCalendarService.new(current_user)
    event = service.create_event(
      summary: params[:title],
      description: params[:description],
      start_time: params[:start_time],
      end_time: params[:end_time],
      attendees: params[:attendees],
      time_zone: params[:time_zone] || 'UTC'
    )

    render json: { event: event }, status: :created
  end
end
```

### Microsoft Calendar Integration

**OAuth Setup**

```ruby
# Gemfile
gem 'oauth2'

# config/initializers/microsoft.rb
MICROSOFT_CLIENT_ID = ENV['MICROSOFT_CLIENT_ID']
MICROSOFT_CLIENT_SECRET = ENV['MICROSOFT_CLIENT_SECRET']
MICROSOFT_REDIRECT_URI = ENV['MICROSOFT_REDIRECT_URI']
MICROSOFT_TENANT = ENV['MICROSOFT_TENANT'] || 'common'
```

**OAuth Flow**

```ruby
class MicrosoftCalendarAuthController < ApplicationController
  def authorize
    client = oauth_client
    authorize_url = client.auth_code.authorize_url(
      redirect_uri: MICROSOFT_REDIRECT_URI,
      scope: 'openid profile email Calendars.ReadWrite offline_access'
    )

    redirect_to authorize_url, allow_other_host: true
  end

  def callback
    client = oauth_client
    token = client.auth_code.get_token(
      params[:code],
      redirect_uri: MICROSOFT_REDIRECT_URI
    )

    current_user.update!(
      microsoft_access_token: token.token,
      microsoft_refresh_token: token.refresh_token,
      microsoft_token_expires_at: Time.at(token.expires_at)
    )

    redirect_to calendars_path, notice: 'Microsoft Calendar connected!'
  end

  private

  def oauth_client
    OAuth2::Client.new(
      MICROSOFT_CLIENT_ID,
      MICROSOFT_CLIENT_SECRET,
      site: 'https://login.microsoftonline.com',
      authorize_url: "/#{MICROSOFT_TENANT}/oauth2/v2.0/authorize",
      token_url: "/#{MICROSOFT_TENANT}/oauth2/v2.0/token"
    )
  end
end
```

**Calendar Service Wrapper**

```ruby
class MicrosoftCalendarService
  BASE_URL = 'https://graph.microsoft.com/v1.0'

  def initialize(user)
    @user = user
    @access_token = ensure_valid_token
  end

  def list_events(start_date: Time.now, end_date: 1.week.from_now)
    url = "#{BASE_URL}/me/calendarview"
    params = {
      startDateTime: start_date.iso8601,
      endDateTime: end_date.iso8601,
      '$orderby': 'start/dateTime'
    }

    response = HTTParty.get(
      url,
      query: params,
      headers: headers
    )

    JSON.parse(response.body)['value']
  end

  def create_event(event_params)
    url = "#{BASE_URL}/me/events"
    
    body = {
      subject: event_params[:subject],
      body: {
        contentType: 'HTML',
        content: event_params[:body]
      },
      start: {
        dateTime: event_params[:start_time].iso8601,
        timeZone: event_params[:time_zone] || 'UTC'
      },
      end: {
        dateTime: event_params[:end_time].iso8601,
        timeZone: event_params[:time_zone] || 'UTC'
      },
      attendees: event_params[:attendees]&.map do |email|
        {
          emailAddress: { address: email },
          type: 'required'
        }
      end
    }

    response = HTTParty.post(
      url,
      body: body.to_json,
      headers: headers
    )

    JSON.parse(response.body)
  end

  def update_event(event_id, event_params)
    url = "#{BASE_URL}/me/events/#{event_id}"
    
    body = {}
    body[:subject] = event_params[:subject] if event_params[:subject]
    body[:body] = { content: event_params[:body] } if event_params[:body]
    
    if event_params[:start_time]
      body[:start] = {
        dateTime: event_params[:start_time].iso8601,
        timeZone: event_params[:time_zone] || 'UTC'
      }
    end
    
    if event_params[:end_time]
      body[:end] = {
        dateTime: event_params[:end_time].iso8601,
        timeZone: event_params[:time_zone] || 'UTC'
      }
    end

    response = HTTParty.patch(
      url,
      body: body.to_json,
      headers: headers
    )

    JSON.parse(response.body)
  end

  def delete_event(event_id)
    url = "#{BASE_URL}/me/events/#{event_id}"
    HTTParty.delete(url, headers: headers)
  end

  def list_calendars
    url = "#{BASE_URL}/me/calendars"
    response = HTTParty.get(url, headers: headers)
    JSON.parse(response.body)['value']
  end

  private

  def ensure_valid_token
    if @user.microsoft_token_expires_at < Time.now
      refresh_token
    else
      @user.microsoft_access_token
    end
  end

  def refresh_token
    client = OAuth2::Client.new(
      MICROSOFT_CLIENT_ID,
      MICROSOFT_CLIENT_SECRET,
      site: 'https://login.microsoftonline.com',
      token_url: "/#{MICROSOFT_TENANT}/oauth2/v2.0/token"
    )

    token = OAuth2::AccessToken.new(
      client,
      @user.microsoft_access_token,
      refresh_token: @user.microsoft_refresh_token
    ).refresh!

    @user.update!(
      microsoft_access_token: token.token,
      microsoft_refresh_token: token.refresh_token,
      microsoft_token_expires_at: Time.at(token.expires_at)
    )

    token.token
  end

  def headers
    {
      'Authorization' => "Bearer #{@access_token}",
      'Content-Type' => 'application/json'
    }
  end
end
```

## Best Practices for Third-Party Integrations

### Error Handling

```ruby
class IntegrationService
  class IntegrationError < StandardError; end
  class RateLimitError < IntegrationError; end
  class AuthenticationError < IntegrationError; end
  class NotFoundError < IntegrationError; end

  def safe_api_call
    retry_count = 0
    max_retries = 3

    begin
      yield
    rescue Net::ReadTimeout, Net::OpenTimeout => e
      retry_count += 1
      if retry_count <= max_retries
        sleep(2**retry_count)  # Exponential backoff
        retry
      else
        raise IntegrationError, "API timeout after #{max_retries} retries"
      end
    rescue RestClient::TooManyRequests => e
      # Handle rate limiting
      retry_after = e.response.headers[:retry_after].to_i
      sleep(retry_after > 0 ? retry_after : 60)
      retry
    rescue RestClient::Unauthorized => e
      raise AuthenticationError, "Authentication failed"
    rescue RestClient::NotFound => e
      raise NotFoundError, "Resource not found"
    end
  end
end
```

### Circuit Breaker Pattern

```ruby
# Gemfile
gem 'circuitbox'

# config/initializers/circuitbox.rb
Circuitbox.configure do |config|
  config.default_circuit_store = Circuitbox::MemoryStore.new
end

# Service with circuit breaker
class ExternalApiService
  def initialize
    @circuit = Circuitbox.circuit(:external_api, {
      exceptions: [Timeout::Error, RestClient::Exception],
      sleep_window: 60,
      volume_threshold: 5,
      error_threshold: 50,
      timeout_seconds: 5
    })
  end

  def fetch_data
    @circuit.run do
      # API call here
      HTTParty.get('https://api.example.com/data')
    end
  rescue Circuitbox::OpenCircuitError
    # Fallback behavior when circuit is open
    Rails.cache.read('fallback_data') || {}
  end
end
```

### Webhook Security

```ruby
class WebhooksController < ApplicationController
  skip_before_action :verify_authenticity_token

  before_action :verify_webhook_signature

  private

  def verify_webhook_signature
    payload = request.body.read
    signature = request.headers['X-Webhook-Signature']
    
    expected_signature = OpenSSL::HMAC.hexdigest(
      'SHA256',
      ENV['WEBHOOK_SECRET'],
      payload
    )

    unless Rack::Utils.secure_compare(signature, expected_signature)
      render json: { error: 'Invalid signature' }, status: 401
    end
  end
end
```

### Idempotency

```ruby
class IdempotentWebhookProcessor
  def process(webhook_id, payload)
    # Check if already processed
    return if WebhookEvent.exists?(external_id: webhook_id)

    ActiveRecord::Base.transaction do
      # Create record to prevent duplicate processing
      WebhookEvent.create!(
        external_id: webhook_id,
        payload: payload,
        processed_at: Time.current
      )

      # Process webhook
      handle_webhook(payload)
    end
  rescue ActiveRecord::RecordNotUnique
    # Already processed by another worker
    Rails.logger.info("Webhook #{webhook_id} already processed")
  end
end
```

### Rate Limiting

```ruby
# Gemfile
gem 'redis'
gem 'redis-namespace'

class RateLimiter
  def initialize(key, limit: 100, period: 1.hour)
    @key = key
    @limit = limit
    @period = period
    @redis = Redis.new
  end

  def throttle
    current = @redis.incr(@key)
    @redis.expire(@key, @period) if current == 1

    if current > @limit
      raise RateLimitError, "Rate limit exceeded"
    end

    yield
  end
end

# Usage
def make_api_call
  limiter = RateLimiter.new("api:stripe:#{current_user.id}", limit: 100, period: 1.hour)
  
  limiter.throttle do
    Stripe::Customer.retrieve(current_user.stripe_customer_id)
  end
end
```

### Background Processing for Webhooks

```ruby
class ProcessWebhookJob < ApplicationJob
  queue_as :webhooks
  
  retry_on StandardError, wait: :exponentially_longer, attempts: 5

  def perform(webhook_type, payload)
    case webhook_type
    when 'stripe'
      StripeWebhookProcessor.new.process(payload)
    when 'chargebee'
      ChargebeeWebhookProcessor.new.process(payload)
    end
  end
end

# In webhook controller
def create
  ProcessWebhookJob.perform_later(params[:type], request.body.read)
  head :ok
end
```

### Caching API Responses

```ruby
class CachedApiService
  def fetch_user_data(user_id)
    cache_key = "api:user:#{user_id}"
    
    Rails.cache.fetch(cache_key, expires_in: 1.hour, race_condition_ttl: 10.seconds) do
      # Expensive API call
      ExternalApi.get_user(user_id)
    end
  end

  def invalidate_cache(user_id)
    Rails.cache.delete("api:user:#{user_id}")
  end
end
```

### API Client with Retry Logic

```ruby
class ResilientApiClient
  include HTTParty
  
  base_uri 'https://api.example.com'
  
  def self.get_with_retry(path, options = {}, max_retries: 3)
    attempt = 0
    
    begin
      attempt += 1
      response = get(path, options)
      
      raise ApiError, "API Error: #{response.code}" unless response.success?
      
      response
    rescue Net::ReadTimeout, Net::OpenTimeout, ApiError => e
      if attempt < max_retries
        sleep(2**attempt)  # Exponential backoff
        retry
      else
        Rails.logger.error("API call failed after #{max_retries} attempts: #{e.message}")
        raise
      end
    end
  end
end
```

### Monitoring and Logging

```ruby
class IntegrationMonitor
  def self.track_api_call(service_name)
    start_time = Time.current
    
    begin
      result = yield
      
      log_success(service_name, Time.current - start_time)
      result
    rescue => e
      log_failure(service_name, Time.current - start_time, e)
      raise
    end
  end

  def self.log_success(service_name, duration)
    Rails.logger.info({
      service: service_name,
      status: 'success',
      duration: duration,
      timestamp: Time.current
    }.to_json)
    
    # Send to monitoring service
    StatsD.increment("api.#{service_name}.success")
    StatsD.timing("api.#{service_name}.duration", duration * 1000)
  end

  def self.log_failure(service_name, duration, error)
    Rails.