# Ruby on Rails - Background Jobs & Async Processing

A comprehensive guide for understanding background job processing in Rails applications.

## Table of Contents
1. [Why Background Jobs?](#why-background-jobs)
2. [Active Job](#active-job)
3. [Job Adapters](#job-adapters)
4. [Sidekiq (Most Common)](#sidekiq)
5. [Delayed Job](#delayed-job)
6. [Resque](#resque)
7. [Job Patterns & Best Practices](#job-patterns--best-practices)
8. [Error Handling & Retries](#error-handling--retries)
9. [Testing Background Jobs](#testing-background-jobs)
10. [Monitoring & Performance](#monitoring--performance)
11. [Common Interview Questions](#common-interview-questions)

---

## Why Background Jobs?

### Use Cases
Background jobs are essential for tasks that:
- Take too long for a web request (> 500ms)
- Don't require immediate user feedback
- Need to be retried on failure
- Should run at scheduled times
- Involve external API calls

**Common Examples:**
- Sending emails
- Processing uploaded files (images, videos)
- Generating reports (PDF, CSV)
- API integrations (Stripe, calendar syncs)
- Data imports/exports
- Webhooks processing
- Cleanup and maintenance tasks

### Benefits
- Improved user experience (faster response times)
- Better resource utilization
- Fault tolerance with retry mechanisms
- Scalability (process jobs on separate servers)

---

## Active Job

Active Job is Rails' unified interface for background job frameworks. It provides a consistent API regardless of the adapter used.

### Creating a Job

```bash
rails generate job SendWelcomeEmail
```

```ruby
# app/jobs/send_welcome_email_job.rb
class SendWelcomeEmailJob < ApplicationJob
  queue_as :default
  
  def perform(user_id)
    user = User.find(user_id)
    UserMailer.welcome_email(user).deliver_now
  end
end
```

### Enqueuing Jobs

```ruby
# Enqueue immediately
SendWelcomeEmailJob.perform_later(user.id)

# Enqueue with delay
SendWelcomeEmailJob.set(wait: 1.hour).perform_later(user.id)

# Enqueue at specific time
SendWelcomeEmailJob.set(wait_until: Date.tomorrow.noon).perform_later(user.id)

# With custom queue
SendWelcomeEmailJob.set(queue: :urgent).perform_later(user.id)
```

### Job Configuration

```ruby
class ApplicationJob < ActiveJob::Base
  # Automatically retry jobs that fail
  retry_on StandardError, wait: 5.seconds, attempts: 3
  
  # Discard specific exceptions
  discard_on ActiveJob::DeserializationError
  
  # Set default queue
  queue_as :default
  
  # Conditional queue
  queue_as do
    if self.arguments.first.priority?
      :high_priority
    else
      :default
    end
  end
end
```

### Callbacks

```ruby
class ProcessDataJob < ApplicationJob
  before_perform :log_start
  after_perform :log_completion
  around_perform :measure_time
  
  def perform(data)
    # Process data
  end
  
  private
  
  def log_start
    Rails.logger.info "Starting job for #{arguments.first}"
  end
  
  def log_completion
    Rails.logger.info "Completed job"
  end
  
  def measure_time
    start_time = Time.current
    yield
    duration = Time.current - start_time
    Rails.logger.info "Job took #{duration} seconds"
  end
end
```

---

## Job Adapters

Active Job supports multiple backends (adapters):

### Configuration

```ruby
# config/application.rb
config.active_job.queue_adapter = :sidekiq

# Or environment-specific
# config/environments/production.rb
config.active_job.queue_adapter = :sidekiq

# config/environments/development.rb
config.active_job.queue_adapter = :async

# config/environments/test.rb
config.active_job.queue_adapter = :test
```

### Available Adapters
- **Sidekiq** - Most popular, Redis-based, multi-threaded
- **Delayed Job** - Database-backed, simpler setup
- **Resque** - Redis-based, multi-process
- **Async** - In-process, Rails default (not for production)
- **Inline** - Executes immediately (testing)
- **Sucker Punch** - In-process, thread-based
- **Sneakers** - RabbitMQ-based
- **Que** - PostgreSQL-based
- **Good Job** - PostgreSQL-based, modern

---

## Sidekiq

Sidekiq is the most popular background job processor for Rails. It's fast, efficient, and uses Redis for job storage.

### Setup

```ruby
# Gemfile
gem 'sidekiq'
gem 'redis'

# config/initializers/sidekiq.rb
Sidekiq.configure_server do |config|
  config.redis = { url: ENV['REDIS_URL'] || 'redis://localhost:6379/0' }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV['REDIS_URL'] || 'redis://localhost:6379/0' }
end
```

### Starting Sidekiq

```bash
bundle exec sidekiq

# With specific config
bundle exec sidekiq -C config/sidekiq.yml

# With concurrency
bundle exec sidekiq -c 25
```

### Configuration File

```yaml
# config/sidekiq.yml
:concurrency: 10
:queues:
  - [critical, 5]
  - [default, 3]
  - [low, 1]

# Concurrency: number of threads
# Queue weights: critical jobs are 5x more likely to be picked than low
```

### Pure Sidekiq Worker (without Active Job)

```ruby
class HardWorker
  include Sidekiq::Worker
  sidekiq_options retry: 5, queue: :default
  
  def perform(name, count)
    # Do something
  end
end

# Enqueue
HardWorker.perform_async('Bob', 5)
HardWorker.perform_in(1.hour, 'Bob', 5)
HardWorker.perform_at(3.hours.from_now, 'Bob', 5)
```

### Sidekiq Pro Features
- Batches (track group of jobs)
- Rate limiting
- Unique jobs
- Periodic jobs (cron-like)
- Filtering and searching

### Memory Management

```ruby
# config/initializers/sidekiq.rb
Sidekiq.configure_server do |config|
  config.death_handlers << ->(job, ex) do
    # Custom logic when job exhausts retries
    Rails.logger.error "Job #{job['jid']} died: #{ex.message}"
  end
end
```

---

## Delayed Job

Database-backed job queue. Simpler than Sidekiq but slower.

### Setup

```ruby
# Gemfile
gem 'delayed_job_active_record'

# Generate migration
rails generate delayed_job:active_record
rails db:migrate
```

### Starting Workers

```bash
bin/delayed_job start
bin/delayed_job -n 2 start  # Start 2 workers
bin/delayed_job stop
bin/delayed_job restart
```

### Direct Usage

```ruby
# Delayed methods
user.delay.send_welcome_email

# Custom job
class EmailJob < Struct.new(:user_id)
  def perform
    user = User.find(user_id)
    UserMailer.welcome_email(user).deliver_now
  end
end

Delayed::Job.enqueue EmailJob.new(user.id), priority: 0, run_at: 5.minutes.from_now
```

### Advantages
- No external dependencies (uses database)
- Easy setup and deployment
- Good for low-volume applications

### Disadvantages
- Slower than Redis-based solutions
- Additional database load
- Limited scalability

---

## Resque

Redis-backed job queue that uses forking for job processing.

### Setup

```ruby
# Gemfile
gem 'resque'

# config/initializers/resque.rb
Resque.redis = Redis.new(url: ENV['REDIS_URL'])
```

### Worker Definition

```ruby
class ImageProcessor
  @queue = :images
  
  def self.perform(image_id)
    image = Image.find(image_id)
    # Process image
  end
end

# Enqueue
Resque.enqueue(ImageProcessor, image.id)
```

### Starting Workers

```bash
QUEUE=* rake resque:work
QUEUE=images rake resque:work
COUNT=5 QUEUE=* rake resque:workers  # Start 5 workers
```

### Key Differences from Sidekiq
- Uses forking (new process per job) vs threading
- More memory usage
- Better isolation (crashed job doesn't affect others)
- Slower job processing

---

## Job Patterns & Best Practices

### 1. Keep Jobs Idempotent

Jobs should produce the same result if run multiple times:

```ruby
# Bad - creates duplicate records
class CreateUserReportJob < ApplicationJob
  def perform(user_id)
    user = User.find(user_id)
    Report.create!(user: user, data: calculate_data(user))
  end
end

# Good - idempotent
class CreateUserReportJob < ApplicationJob
  def perform(user_id)
    user = User.find(user_id)
    report = Report.find_or_initialize_by(
      user: user, 
      report_date: Date.today
    )
    report.data = calculate_data(user)
    report.save!
  end
end
```

### 2. Pass IDs, Not Objects

```ruby
# Bad - serialization issues, stale data
SendEmailJob.perform_later(user)

# Good - fetch fresh data
SendEmailJob.perform_later(user.id)
```

### 3. Use Specific Queues

```ruby
class CriticalNotificationJob < ApplicationJob
  queue_as :critical
  # ...
end

class ReportGenerationJob < ApplicationJob
  queue_as :low_priority
  # ...
end
```

### 4. Batch Processing Pattern

```ruby
class ProcessUsersJob < ApplicationJob
  def perform(batch_size = 100)
    User.where(processed: false).find_in_batches(batch_size: batch_size) do |users|
      users.each do |user|
        ProcessSingleUserJob.perform_later(user.id)
      end
    end
  end
end
```

### 5. Chain Jobs

```ruby
class ImportDataJob < ApplicationJob
  def perform(file_path)
    data = parse_file(file_path)
    
    data.each do |record|
      ProcessRecordJob.perform_later(record)
    end
    
    # Schedule cleanup after all processing
    CleanupJob.set(wait: 1.hour).perform_later(file_path)
  end
end
```

### 6. Job Status Tracking

```ruby
class LongRunningJob < ApplicationJob
  def perform(user_id)
    user = User.find(user_id)
    
    # Update status in database
    job_status = JobStatus.create!(
      user: user,
      status: 'processing',
      job_id: job_id
    )
    
    begin
      # Do work
      process_data(user)
      
      job_status.update!(status: 'completed')
    rescue => e
      job_status.update!(status: 'failed', error: e.message)
      raise
    end
  end
end
```

### 7. Avoid Long-Running Jobs

Break into smaller chunks:

```ruby
# Bad - processes everything in one job
class ProcessAllUsersJob < ApplicationJob
  def perform
    User.find_each do |user|
      # Long processing
    end
  end
end

# Good - chunked processing
class ProcessUserBatchJob < ApplicationJob
  def perform(offset, limit)
    User.offset(offset).limit(limit).each do |user|
      ProcessSingleUserJob.perform_later(user.id)
    end
    
    # Schedule next batch
    if User.count > offset + limit
      ProcessUserBatchJob.perform_later(offset + limit, limit)
    end
  end
end
```

---

## Error Handling & Retries

### Retry Configuration

```ruby
class ApplicationJob < ActiveJob::Base
  # Exponential backoff
  retry_on StandardError, wait: :exponentially_longer, attempts: 5
  
  # Polynomial backoff
  retry_on Timeout::Error, wait: :polynomially_longer, attempts: 10
  
  # Custom wait time
  retry_on ApiError, wait: 1.hour, attempts: 3
  
  # Conditional retry
  retry_on CustomError, attempts: 3 do |job, error|
    if error.retryable?
      # Will retry
    else
      # Send alert and discard
      AlertService.notify(error)
    end
  end
end
```

### Discard Conditions

```ruby
class ProcessPaymentJob < ApplicationJob
  # Don't retry these errors
  discard_on ActiveRecord::RecordNotFound
  discard_on Stripe::CardError
  
  def perform(payment_id)
    payment = Payment.find(payment_id)
    StripeService.charge(payment)
  end
end
```

### Manual Retry Logic

```ruby
class ApiCallJob < ApplicationJob
  retry_on ApiTimeout, wait: 5.seconds, attempts: 3
  
  def perform(endpoint)
    max_retries = 3
    retry_count = 0
    
    begin
      call_api(endpoint)
    rescue TemporaryError => e
      retry_count += 1
      if retry_count < max_retries
        sleep(2 ** retry_count)  # Exponential backoff
        retry
      else
        raise
      end
    end
  end
end
```

### Dead Letter Queue Pattern

```ruby
class ApplicationJob < ActiveJob::Base
  rescue_from(StandardError) do |exception|
    # Log to error tracking
    Rollbar.error(exception, job: self.class.name, arguments: arguments)
    
    # Store in dead letter queue for manual review
    if executions >= 5
      FailedJob.create!(
        job_class: self.class.name,
        arguments: arguments,
        error: exception.message,
        backtrace: exception.backtrace
      )
    else
      raise exception  # Retry
    end
  end
end
```

---

## Testing Background Jobs

### RSpec Examples

```ruby
# spec/jobs/send_email_job_spec.rb
require 'rails_helper'

RSpec.describe SendEmailJob, type: :job do
  describe '#perform' do
    let(:user) { create(:user) }
    
    it 'sends an email' do
      expect {
        described_class.perform_now(user.id)
      }.to change { ActionMailer::Base.deliveries.count }.by(1)
    end
    
    it 'enqueues the job' do
      expect {
        described_class.perform_later(user.id)
      }.to have_enqueued_job(described_class)
        .with(user.id)
        .on_queue('default')
    end
    
    it 'schedules the job' do
      expect {
        described_class.set(wait: 1.hour).perform_later(user.id)
      }.to have_enqueued_job(described_class)
        .with(user.id)
        .at(1.hour.from_now)
    end
  end
end
```

### Testing Job Execution

```ruby
RSpec.describe ProcessDataJob do
  include ActiveJob::TestHelper
  
  after do
    clear_enqueued_jobs
  end
  
  it 'processes data correctly' do
    user = create(:user)
    
    perform_enqueued_jobs do
      ProcessDataJob.perform_later(user.id)
    end
    
    expect(user.reload.processed).to be true
  end
  
  it 'handles errors' do
    allow(SomeService).to receive(:call).and_raise(StandardError)
    
    expect {
      ProcessDataJob.perform_now(user.id)
    }.to raise_error(StandardError)
  end
end
```

### Testing Retries

```ruby
RSpec.describe RetryableJob do
  it 'retries on failure' do
    allow(ExternalApi).to receive(:call).and_raise(Timeout::Error)
    
    expect {
      perform_enqueued_jobs do
        RetryableJob.perform_later('data')
      end
    }.to raise_error(Timeout::Error)
    
    # Check retry was scheduled
    expect(RetryableJob).to have_been_enqueued.exactly(4).times
  end
end
```

### Integration Testing

```ruby
feature 'User signup' do
  scenario 'sends welcome email in background' do
    visit signup_path
    fill_in 'Email', with: 'user@example.com'
    click_button 'Sign Up'
    
    expect(page).to have_content('Welcome!')
    
    # Verify job was enqueued
    expect(SendWelcomeEmailJob).to have_been_enqueued
    
    # Process jobs and verify email sent
    perform_enqueued_jobs
    expect(ActionMailer::Base.deliveries.last.to).to include('user@example.com')
  end
end
```

---

## Monitoring & Performance

### Monitoring Tools

1. **Sidekiq Web UI**
```ruby
# config/routes.rb
require 'sidekiq/web'

authenticate :user, ->(user) { user.admin? } do
  mount Sidekiq::Web => '/sidekiq'
end
```

2. **Custom Metrics**
```ruby
class ApplicationJob < ActiveJob::Base
  around_perform do |_job, block|
    start_time = Time.current
    block.call
    duration = Time.current - start_time
    
    # Log to monitoring service
    Metrics.timing("job.#{self.class.name}.duration", duration)
    Metrics.increment("job.#{self.class.name}.success")
  rescue => e
    Metrics.increment("job.#{self.class.name}.failure")
    raise e
  end
end
```

3. **Error Tracking**
```ruby
class ApplicationJob < ActiveJob::Base
  rescue_from(StandardError) do |exception|
    Rollbar.error(
      exception,
      job_class: self.class.name,
      job_id: job_id,
      arguments: arguments,
      executions: executions
    )
    raise exception
  end
end
```

### Performance Best Practices

1. **Connection Pooling**
```ruby
# config/database.yml
production:
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 25 } %>
  
# Sidekiq config
Sidekiq.configure_server do |config|
  config.redis = { url: ENV['REDIS_URL'], size: 25 }
  
  # Ensure DB pool matches concurrency
  db_config = ActiveRecord::Base.configurations[Rails.env]
  db_config['pool'] = ENV.fetch('SIDEKIQ_CONCURRENCY', 25).to_i
  ActiveRecord::Base.establish_connection(db_config)
end
```

2. **Batch Database Operations**
```ruby
class BulkUpdateJob < ApplicationJob
  def perform(user_ids)
    # Bad - N queries
    # user_ids.each { |id| User.find(id).update!(processed: true) }
    
    # Good - 1 query
    User.where(id: user_ids).update_all(processed: true)
  end
end
```

3. **Memory Management**
```ruby
class ProcessLargeDataJob < ApplicationJob
  def perform
    User.find_each(batch_size: 100) do |user|
      process_user(user)
      
      # Clear AR query cache periodically
      ActiveRecord::Base.connection.clear_query_cache
    end
    
    # Force garbage collection for very large jobs
    GC.start
  end
end
```

4. **Queue Priority Management**
```ruby
# config/sidekiq.yml
:queues:
  - [critical, 10]    # Process 10x more than default
  - [default, 5]
  - [mailers, 3]
  - [low, 1]
```

---

## Common Interview Questions

### Conceptual Questions

**Q: What's the difference between Active Job and Sidekiq?**
A: Active Job is Rails' framework-agnostic interface for background jobs. Sidekiq is a specific job processor implementation. Active Job lets you switch processors without changing job code. Sidekiq uses Redis and multi-threading for high performance.

**Q: When would you use `perform_now` vs `perform_later`?**
A: 
- `perform_now` - Executes synchronously, blocks current process. Use in tests or when you need immediate execution.
- `perform_later` - Enqueues for async processing. Use for production code to avoid blocking web requests.

**Q: How do you handle job failures?**
A: Multiple strategies:
1. Automatic retries with exponential backoff
2. Discard irrecoverable errors (RecordNotFound)
3. Dead letter queue for manual review
4. Alert on repeated failures
5. Implement idempotency to handle duplicate processing

**Q: What's the difference between Sidekiq and Delayed Job?**
A:
- **Sidekiq**: Redis-based, multi-threaded, faster, needs Redis server
- **Delayed Job**: Database-backed, multi-process, simpler setup, slower
- Use Sidekiq for high volume, DJ for low volume or when you can't run Redis

**Q: How would you process a million records in background?**
A:
```ruby
# Break into manageable chunks
class ProcessMillionRecordsJob < ApplicationJob
  def perform
    batch_size = 1000
    total_batches = (User.count / batch_size.to_f).ceil
    
    (0...total_batches).each do |batch_num|
      ProcessBatchJob.perform_later(batch_num, batch_size)
    end
  end
end

class ProcessBatchJob < ApplicationJob
  def perform(batch_num, batch_size)
    offset = batch_num * batch_size
    User.offset(offset).limit(batch_size).each do |user|
      ProcessUserJob.perform_later(user.id)
    end
  end
end
```

**Q: How do you prevent duplicate job execution?**
A: Several approaches:
1. Database uniqueness constraints
2. Redis-based locking
3. Sidekiq unique jobs (Sidekiq Pro)
4. Custom job tracking table
```ruby
class UniqueJob < ApplicationJob
  def perform(user_id)
    lock_key = "job:unique:#{user_id}"
    
    unless Redis.current.set(lock_key, '1', nx: true, ex: 300)
      logger.info "Job already running for user #{user_id}"
      return
    end
    
    begin
      # Do work
    ensure
      Redis.current.del(lock_key)
    end
  end
end
```

**Q: How would you implement job chaining?**
A:
```ruby
class Step1Job < ApplicationJob
  def perform(data_id)
    # Process step 1
    result = process_step_1(data_id)
    
    # Chain to step 2
    Step2Job.perform_later(data_id, result)
  end
end

class Step2Job < ApplicationJob
  def perform(data_id, step1_result)
    # Process step 2 with step 1 results
    result = process_step_2(data_id, step1_result)
    
    Step3Job.perform_later(data_id, result)
  end
end
```

**Q: How do you test background jobs?**
A: Multiple approaches:
```ruby
# Test job was enqueued
expect { SomeJob.perform_later(args) }
  .to have_enqueued_job(SomeJob)

# Execute jobs inline for integration tests
perform_enqueued_jobs do
  # Trigger action that enqueues job
  # Verify side effects
end

# Test job logic directly
SomeJob.perform_now(args)
```

**Q: What happens if Redis goes down in Sidekiq?**
A: 
- New jobs cannot be enqueued (will raise errors)
- Running jobs continue to completion
- Jobs in queues are safe (persist in Redis)
- After Redis recovers, processing resumes
- Implement circuit breaker pattern to handle Redis failures gracefully

**Q: How would you implement rate limiting for API calls in jobs?**
A:
```ruby
class RateLimitedApiJob < ApplicationJob
  def perform(user_id)
    rate_limiter = RateLimiter.new(
      key: "api:user:#{user_id}",
      limit: 100,
      period: 1.hour
    )
    
    if rate_limiter.exceeded?
      # Re-enqueue for later
      RateLimitedApiJob.set(wait: 5.minutes).perform_later(user_id)
      return
    end
    
    rate_limiter.increment
    make_api_call(user_id)
  end
end

class RateLimiter
  def initialize(key:, limit:, period:)
    @redis = Redis.current
    @key = "rate_limit:#{key}"
    @limit = limit
    @period = period
  end
  
  def exceeded?
    @redis.get(@key).to_i >= @limit
  end
  
  def increment
    @redis.multi do |r|
      r.incr(@key)
      r.expire(@key, @period)
    end
  end
end
```

### Practical Scenarios

**Q: Design a system to send daily digest emails to all users**
```ruby
# Scheduled job (using whenever gem or cron)
class DailyDigestSchedulerJob < ApplicationJob
  def perform
    User.active.find_in_batches(batch_size: 1000) do |users|
      users.each do |user|
        SendDigestEmailJob.perform_later(user.id)
      end
    end
  end
end

class SendDigestEmailJob < ApplicationJob
  queue_as :mailers
  
  def perform(user_id)
    user = User.find(user_id)
    return unless user.digest_enabled?
    
    digest_content = DigestBuilder.new(user).build
    UserMailer.daily_digest(user, digest_content).deliver_now
  end
end
```

**Q: How would you handle webhook processing?**
```ruby
class WebhookController < ApplicationController
  def stripe
    payload = request.body.read
    sig_header = request.headers['Stripe-Signature']
    
    # Verify webhook signature
    event = Stripe::Webhook.construct_event(
      payload, sig_header, ENV['STRIPE_WEBHOOK_SECRET']
    )
    
    # Process async
    ProcessStripeWebhookJob.perform_later(event.to_json)
    
    head :ok
  rescue JSON::ParserError, Stripe::SignatureVerificationError => e
    head :bad_request
  end
end

class ProcessStripeWebhookJob < ApplicationJob
  def perform(event_json)
    event = JSON.parse(event_json)
    
    case event['type']
    when 'payment_intent.succeeded'
      handle_payment_success(event['data']['object'])
    when 'customer.subscription.deleted'
      handle_subscription_canceled(event['data']['object'])
    end
  end
end
```

---

## Additional Resources

### Configuration Files
- `config/sidekiq.yml` - Sidekiq configuration
- `config/application.rb` - Active Job adapter setup
- `Procfile` - Process management (for Heroku)

### Useful Gems
- **sidekiq** - Background processing
- **sidekiq-cron** - Scheduled jobs
- **sidekiq-unique-jobs** - Prevent duplicates
- **sidekiq-failures** - Track failed jobs
- **delayed_job** - Alternative processor
- **good_job** - PostgreSQL-based processor
- **whenever** - Cron job management

### Monitoring Services
- Sidekiq Pro/Enterprise (official)
- New Relic
- DataDog
- Scout APM
- Skylight

---

## Quick Reference

### Common Commands
```bash
# Sidekiq
bundle exec sidekiq -C config/sidekiq.yml
bundle exec sidekiq -e production -c 25

# Delayed Job
bin/delayed_job start
bin/delayed_job stop
bin/delayed_job -n 4 start

# Rails console testing
rails c
> MyJob.perform_later(args)
> Sidekiq::Queue.new('default').size
> Sidekiq::Queue.new('default').clear
```

### Job Lifecycle
1. Job is enqueued → stored in Redis/DB
2. Worker picks up job from queue
3. Job is executed
4. On success: marked complete, removed from queue
5. On failure: retry or mov


