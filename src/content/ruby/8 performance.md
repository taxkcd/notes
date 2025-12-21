


# Performance Optimization

## Database Query Optimization

### N+1 Query Problem

The N+1 problem occurs when you execute one query to fetch a collection, then execute N additional queries to fetch associated records.

```ruby
# BAD - N+1 queries
@users = User.all
@users.each do |user|
  puts user.posts.count  # Executes a query for each user
end

# GOOD - Using includes
@users = User.includes(:posts)
@users.each do |user|
  puts user.posts.count  # No additional queries
end
```

**Eager Loading Methods:**
- `includes` - Loads associations using separate queries (LEFT OUTER JOIN)
- `preload` - Always uses separate queries
- `eager_load` - Uses LEFT OUTER JOIN in a single query
- `joins` - INNER JOIN, doesn't load associated records

```ruby
# includes - Best for most cases
User.includes(:posts, :comments)

# preload - When you want separate queries explicitly
User.preload(:posts)

# eager_load - When you need to query on associations
User.eager_load(:posts).where(posts: { published: true })

# joins - When you only need to filter, not load data
User.joins(:posts).where(posts: { published: true }).distinct
```

### Select Only Required Columns

```ruby
# BAD - Loads all columns
User.all

# GOOD - Select specific columns
User.select(:id, :name, :email)

# Using pluck for simple arrays
User.pluck(:email)  # Returns array of emails
User.pluck(:id, :name)  # Returns array of arrays
```

### Database Indexing

```ruby
# Migration for adding indexes
class AddIndexesToUsers < ActiveRecord::Migration[7.0]
  def change
    add_index :users, :email, unique: true
    add_index :posts, :user_id
    add_index :posts, [:user_id, :published_at]
    add_index :posts, :title, using: :gin  # For full-text search
  end
end
```

**When to Add Indexes:**
- Foreign keys
- Columns used in WHERE clauses
- Columns used in ORDER BY
- Columns used in JOIN conditions
- Unique constraints

**Index Types:**
- B-tree (default) - Best for equality and range queries
- GiST/GIN - For full-text search, arrays, JSON
- Hash - For equality comparisons only

### Query Optimization Techniques

```ruby
# Use exists? instead of any? for existence checks
# BAD
User.where(active: true).any?

# GOOD
User.where(active: true).exists?

# Use find_each for batch processing
# BAD - Loads all records into memory
User.all.each do |user|
  user.send_email
end

# GOOD - Processes in batches of 1000
User.find_each(batch_size: 1000) do |user|
  user.send_email
end

# Use find_in_batches for batch operations
User.find_in_batches(batch_size: 500) do |users|
  BulkEmailService.send(users)
end

# Counter cache for associations
class Post < ApplicationRecord
  belongs_to :user, counter_cache: true
end

# Migration
add_column :users, :posts_count, :integer, default: 0
```

### Raw SQL and AREL

```ruby
# Raw SQL for complex queries
users = User.find_by_sql([
  "SELECT users.*, COUNT(posts.id) as post_count 
   FROM users 
   LEFT JOIN posts ON posts.user_id = users.id 
   WHERE users.created_at > ? 
   GROUP BY users.id 
   HAVING COUNT(posts.id) > ?", 
  1.year.ago, 5
])

# Using AREL for dynamic queries
users = User.arel_table
posts = Post.arel_table

query = users
  .join(posts, Arel::Nodes::OuterJoin)
  .on(users[:id].eq(posts[:user_id]))
  .where(users[:created_at].gt(1.year.ago))
  .project(users[:id], users[:name])

User.find_by_sql(query.to_sql)
```

## Caching Integration

### Fragment Caching

```ruby
# In views
<% cache @product do %>
  <%= render @product %>
<% end %>

# With Russian Doll caching
<% cache @product do %>
  <h1><%= @product.name %></h1>
  
  <% cache [@product, 'reviews'] do %>
    <%= render @product.reviews %>
  <% end %>
<% end %>

# Cache with conditions
<% cache_if user_signed_in?, @product do %>
  <%= render @product %>
<% end %>
```

### Low-Level Caching

```ruby
# Cache expensive computations
def expensive_calculation
  Rails.cache.fetch("user-#{id}-calculation", expires_in: 1.hour) do
    # Expensive operation
    calculate_complex_data
  end
end

# Cache with race condition protection
Rails.cache.fetch("key", expires_in: 5.minutes, race_condition_ttl: 10.seconds) do
  expensive_operation
end

# Manual cache management
Rails.cache.write("key", value, expires_in: 1.hour)
Rails.cache.read("key")
Rails.cache.delete("key")
Rails.cache.exist?("key")
```

### Query Caching

```ruby
# Automatically enabled within a single request
User.find(1)  # Database hit
User.find(1)  # Cached result

# Manual query cache control
ActiveRecord::Base.cache do
  User.find(1)  # Database hit
  User.find(1)  # Cached
end

ActiveRecord::Base.uncached do
  User.find(1)  # Always hits database
end
```

## Asset Optimization

### Asset Pipeline & Propshaft/Sprockets

```ruby
# config/environments/production.rb
config.assets.compile = false
config.assets.digest = true
config.public_file_server.enabled = ENV['RAILS_SERVE_STATIC_FILES'].present?

# Precompile assets
rails assets:precompile

# Clean old assets
rails assets:clean
```

### Image Optimization

```ruby
# Use image_processing gem with Active Storage
class User < ApplicationRecord
  has_one_attached :avatar
  
  def avatar_thumbnail
    avatar.variant(
      resize_to_limit: [100, 100],
      format: :webp,
      saver: { quality: 80 }
    )
  end
end

# In views
<%= image_tag user.avatar_thumbnail %>

# Lazy loading images
<%= image_tag @product.image, loading: :lazy %>
```

### CDN Configuration

```ruby
# config/environments/production.rb
config.asset_host = 'https://cdn.example.com'

# For Active Storage
config.active_storage.service = :amazon

# config/storage.yml
amazon:
  service: S3
  access_key_id: <%= ENV['AWS_ACCESS_KEY_ID'] %>
  secret_access_key: <%= ENV['AWS_SECRET_ACCESS_KEY'] %>
  region: us-east-1
  bucket: your-bucket-name
```

## Background Job Optimization

### Sidekiq Performance

```ruby
# config/sidekiq.yml
:concurrency: 10
:queues:
  - critical
  - default
  - low_priority

# Batch processing
class BulkEmailWorker
  include Sidekiq::Worker
  sidekiq_options queue: :default, retry: 3
  
  def perform(user_ids)
    User.where(id: user_ids).find_each do |user|
      UserMailer.notification(user).deliver_now
    end
  end
end

# Schedule in batches
User.pluck(:id).each_slice(100) do |batch|
  BulkEmailWorker.perform_async(batch)
end

# Use sidekiq-batch for complex workflows
batch = Sidekiq::Batch.new
batch.on(:success, SomeBatchCallback)
batch.jobs do
  user_ids.each { |id| SomeWorker.perform_async(id) }
end
```

### Job Optimization

```ruby
# BAD - Passing entire objects
SomeWorker.perform_async(user)

# GOOD - Passing IDs only
SomeWorker.perform_async(user.id)

class SomeWorker
  include Sidekiq::Worker
  
  def perform(user_id)
    user = User.find(user_id)
    # Process user
  end
end

# Use unique jobs to prevent duplicates
class ReportWorker
  include Sidekiq::Worker
  sidekiq_options lock: :until_executed, 
                   on_conflict: :reject
  
  def perform(user_id)
    # Generate report
  end
end
```

## Memory Management

### Memory Profiling

```ruby
# Use memory_profiler gem
require 'memory_profiler'

report = MemoryProfiler.report do
  # Code to profile
  User.includes(:posts).limit(100).to_a
end

report.pretty_print

# Check memory usage
puts `ps -o rss= -p #{Process.pid}`.to_i / 1024  # MB

# Use derailed_benchmarks gem
bundle exec derailed bundle:mem
bundle exec derailed bundle:objects
```

### Memory Leak Prevention

```ruby
# Avoid storing large objects in memory
# BAD
@all_users = User.all.to_a

# GOOD
User.find_each do |user|
  process(user)
end

# Clear associations when done
users.each do |user|
  process(user.posts)
  user.association(:posts).reset
end

# Use connection pool properly
ActiveRecord::Base.connection_pool.with_connection do
  # Database operations
end
```

## HTTP & Network Optimization

### Compression

```ruby
# config/application.rb
config.middleware.use Rack::Deflater

# Or use Rack::Brotli for better compression
config.middleware.use Rack::Brotli
```

### HTTP/2 Server Push

```ruby
# In controller
def show
  response.headers['Link'] = '</assets/application.css>; rel=preload; as=style'
end
```

### Connection Pooling

```ruby
# config/database.yml
production:
  adapter: postgresql
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  timeout: 5000

# For external APIs
require 'net/http/persistent'

class ExternalApiClient
  def initialize
    @http = Net::HTTP::Persistent.new(name: 'api_client')
    @http.idle_timeout = 10
    @http.max_requests = 100
  end
  
  def fetch_data(url)
    uri = URI(url)
    @http.request(uri)
  end
end
```

## Database Connection Optimization

### Connection Pool Configuration

```ruby
# config/database.yml
production:
  pool: <%= ENV.fetch("DB_POOL") { 25 } %>
  checkout_timeout: 5
  reaping_frequency: 10
  
# Multiple database connections
production:
  primary:
    adapter: postgresql
    pool: 25
  cache:
    adapter: redis
    pool: 25
```

### Query Timeout

```ruby
# config/initializers/database.rb
ActiveRecord::Base.connection.execute('SET statement_timeout TO 5000')  # 5 seconds

# Per-query timeout
User.connection.execute('SET LOCAL statement_timeout TO 1000')
User.where(active: true).to_a
```

## Rack Middleware Optimization

```ruby
# config/application.rb

# Remove unused middleware
config.middleware.delete Rack::Lock
config.middleware.delete ActionDispatch::Flash

# Add custom middleware for performance
config.middleware.use Rack::Timeout, service_timeout: 15

# Optimize request logging
config.middleware.swap Rails::Rack::Logger, CustomLogger
```

## Profiling & Monitoring

### Rack Mini Profiler

```ruby
# Gemfile
gem 'rack-mini-profiler'

# In views, you'll see a speed badge
# Access detailed profiling at /?pp=help

# Disable in test environment
# config/environments/test.rb
config.middleware.delete Rack::MiniProfiler
```

### Bullet Gem (N+1 Detection)

```ruby
# Gemfile
gem 'bullet', group: :development

# config/environments/development.rb
config.after_initialize do
  Bullet.enable = true
  Bullet.alert = true
  Bullet.bullet_logger = true
  Bullet.console = true
  Bullet.rails_logger = true
  Bullet.add_footer = true
end
```

### Custom Instrumentation

```ruby
# Subscribe to ActiveSupport notifications
ActiveSupport::Notifications.subscribe('process_action.action_controller') do |*args|
  event = ActiveSupport::Notifications::Event.new(*args)
  puts "Request took: #{event.duration}ms"
end

# Custom instrumentation
ActiveSupport::Notifications.instrument('custom.event', user_id: user.id) do
  # Code to measure
  expensive_operation
end

# Subscribe to custom events
ActiveSupport::Notifications.subscribe('custom.event') do |name, start, finish, id, payload|
  duration = (finish - start) * 1000
  Rails.logger.info "Custom event took #{duration}ms for user #{payload[:user_id]}"
end
```

### Benchmarking

```ruby
# Using Benchmark module
require 'benchmark'

time = Benchmark.measure do
  User.includes(:posts).limit(1000).to_a
end
puts "Time: #{time.real} seconds"

# Compare multiple approaches
Benchmark.bm(20) do |x|
  x.report("includes:") { User.includes(:posts).limit(100).to_a }
  x.report("preload:") { User.preload(:posts).limit(100).to_a }
  x.report("eager_load:") { User.eager_load(:posts).limit(100).to_a }
end
```

## Response Time Optimization

### Database View Materialization

```ruby
# Create materialized view migration
class CreateUserStatsView < ActiveRecord::Migration[7.0]
  def up
    execute <<-SQL
      CREATE MATERIALIZED VIEW user_stats AS
      SELECT 
        users.id,
        users.name,
        COUNT(DISTINCT posts.id) as posts_count,
        COUNT(DISTINCT comments.id) as comments_count
      FROM users
      LEFT JOIN posts ON posts.user_id = users.id
      LEFT JOIN comments ON comments.user_id = users.id
      GROUP BY users.id, users.name
    SQL
    
    add_index :user_stats, :id, unique: true
  end
  
  def down
    execute "DROP MATERIALIZED VIEW user_stats"
  end
end

# Refresh materialized view
ActiveRecord::Base.connection.execute('REFRESH MATERIALIZED VIEW user_stats')

# Model
class UserStat < ApplicationRecord
  self.primary_key = 'id'
  
  def readonly?
    true
  end
end
```

### Partial Indexes

```ruby
# Migration
class AddPartialIndexes < ActiveRecord::Migration[7.0]
  def change
    add_index :posts, :user_id, 
              where: "published_at IS NOT NULL",
              name: 'index_posts_on_user_id_published'
  end
end
```

## Action Cable Performance

```ruby
# Use async adapter in production
# config/cable.yml
production:
  adapter: redis
  url: <%= ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" } %>
  channel_prefix: myapp_production

# Optimize broadcasting
# BAD - Broadcasting to all
ActionCable.server.broadcast("notifications", data)

# GOOD - Targeted streaming
ActionCable.server.broadcast("notifications:#{user.id}", data)

# Stream from model
class NotificationChannel < ApplicationCable::Channel
  def subscribed
    stream_for current_user
  end
end

# Broadcast to specific user
NotificationChannel.broadcast_to(user, data)
```

## Key Performance Metrics to Monitor

1. **Response Time**: p50, p95, p99 percentiles
2. **Throughput**: Requests per second
3. **Database Query Time**: Slow query log
4. **Memory Usage**: Heap size, object allocation
5. **Error Rate**: 4xx and 5xx responses
6. **Background Job Processing**: Queue depth, processing time
7. **Cache Hit Rate**: Percentage of cache hits vs misses
8. **Database Connection Pool**: Active connections, wait time

## Quick Wins Checklist

- [ ] Enable query caching
- [ ] Add database indexes on foreign keys
- [ ] Use eager loading to eliminate N+1 queries
- [ ] Enable asset compression (gzip/brotli)
- [ ] Configure CDN for static assets
- [ ] Use counter_cache for association counts
- [ ] Set up Redis for caching and sessions
- [ ] Enable fragment caching for expensive views
- [ ] Use select/pluck instead of loading full objects
- [ ] Configure database connection pooling
- [ ] Enable HTTP/2 if possible
- [ ] Use background jobs for time-consuming tasks
- [ ] Add pagination to large collections
- [ ] Optimize images (WebP, lazy loading)
- [ ] Monitor with Bullet and rack-mini-profiler in development


