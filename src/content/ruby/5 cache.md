# Rails Caching Strategies - Comprehensive Guide

## Table of Contents
- [Cache Types Overview](#cache-types-overview)
- [Page Caching](#page-caching)
- [Action Caching](#action-caching)
- [Fragment Caching](#fragment-caching)
- [Low-Level Caching](#low-level-caching)
- [SQL Caching](#sql-caching)
- [HTTP Caching](#http-caching)
- [Russian Doll Caching](#russian-doll-caching)
- [Cache Stores](#cache-stores)
- [Cache Expiration Strategies](#cache-expiration-strategies)
- [Caching Best Practices](#caching-best-practices)
- [Cache Invalidation](#cache-invalidation)
- [Performance Monitoring](#performance-monitoring)

---

## Cache Types Overview

Rails provides multiple caching layers:

| Cache Type | Use Case | Speed | Complexity |
|------------|----------|-------|------------|
| Page Cache | Static pages | Fastest | Low |
| Action Cache | Dynamic pages with static content | Fast | Low |
| Fragment Cache | Partial page sections | Medium | Medium |
| Low-Level Cache | Data objects, calculations | Medium | Medium |
| SQL Cache | Database query results | Fast | Automatic |
| HTTP Cache | Browser/CDN caching | Fastest | Medium |

---

## Page Caching

Page caching stores entire HTML pages as static files. **Note:** Removed from Rails 4+ core, available as gem.

```ruby
# Gemfile
gem 'actionpack-page_caching'

# config/application.rb
config.action_controller.page_cache_directory = "#{Rails.root}/public"

# app/controllers/articles_controller.rb
class ArticlesController < ApplicationController
  caches_page :index, :show
  
  def index
    @articles = Article.published
  end
  
  def show
    @article = Article.find(params[:id])
  end
end

# Clear cache when article changes
class Article < ApplicationRecord
  after_save :clear_cache
  after_destroy :clear_cache
  
  private
  
  def clear_cache
    ActionController::Base.expire_page(articles_path)
    ActionController::Base.expire_page(article_path(self))
  end
end
```

**Pros:**
- Extremely fast (served by web server directly)
- No Rails processing required

**Cons:**
- Cannot cache authenticated content
- Not suitable for dynamic content
- Manual cache invalidation required

---

## Action Caching

Similar to page caching but runs before filters (authentication). **Note:** Removed from Rails 4+ core.

```ruby
# Gemfile
gem 'actionpack-action_caching'

# app/controllers/articles_controller.rb
class ArticlesController < ApplicationController
  before_action :authenticate_user!
  caches_action :show, :index, cache_path: proc { |c| c.params }
  
  def show
    @article = Article.find(params[:id])
  end
end

# Expire action cache
expire_action action: :show, id: @article.id
```

**Use Cases:**
- Pages requiring authentication
- Content that changes infrequently
- Pages with dynamic headers/footers

---

## Fragment Caching

Caches portions of views. Most commonly used caching strategy in modern Rails.

### Basic Fragment Caching

```ruby
# app/views/articles/show.html.erb
<% cache @article do %>
  <h1><%= @article.title %></h1>
  <p><%= @article.content %></p>
  <p>Published: <%= @article.published_at %></p>
<% end %>

# Cache key generated: articles/123-20241126120000
```

### Cache with Multiple Dependencies

```ruby
<% cache [@article, @user] do %>
  <h1><%= @article.title %></h1>
  <p>Viewed by: <%= @user.name %></p>
<% end %>

# Cache key: articles/123-20241126120000/users/456-20241126110000
```

### Cache with Custom Keys

```ruby
<% cache "article_#{@article.id}_summary" do %>
  <%= render partial: 'article_summary', locals: { article: @article } %>
<% end %>

# Expire custom cache
Rails.cache.delete("article_#{@article.id}_summary")
```

### Conditional Caching

```ruby
<% cache_if user_signed_in?, @article do %>
  <%= render @article %>
<% end %>

<% cache_unless @article.draft?, @article do %>
  <%= render @article %>
<% end %>
```

### Cache with Expiration

```ruby
<% cache @article, expires_in: 1.hour do %>
  <%= render @article %>
<% end %>
```

### Caching Collections

```ruby
# app/views/articles/index.html.erb
<% cache ['articles', Article.maximum(:updated_at)] do %>
  <%= render @articles %>
<% end %>

# Or cache each item individually
<% @articles.each do |article| %>
  <% cache article do %>
    <%= render article %>
  <% end %>
<% end %>
```

---

## Low-Level Caching

Direct cache manipulation for data, calculations, or expensive operations.

### Basic Read/Write

```ruby
# Write to cache
Rails.cache.write('user_count', User.count, expires_in: 1.hour)

# Read from cache
user_count = Rails.cache.read('user_count')

# Fetch (read or write if missing)
user_count = Rails.cache.fetch('user_count', expires_in: 1.hour) do
  User.count
end
```

### Complex Data Caching

```ruby
class Article < ApplicationRecord
  def self.trending
    Rails.cache.fetch('trending_articles', expires_in: 15.minutes) do
      Article.where('created_at > ?', 1.week.ago)
             .order(views_count: :desc)
             .limit(10)
             .to_a
    end
  end
  
  def related_articles
    Rails.cache.fetch("article_#{id}_related", expires_in: 1.day) do
      Article.where(category: category)
             .where.not(id: id)
             .limit(5)
             .to_a
    end
  end
end
```

### Caching Expensive Calculations

```ruby
class Report
  def self.monthly_revenue(month)
    cache_key = "revenue_report_#{month.strftime('%Y%m')}"
    
    Rails.cache.fetch(cache_key, expires_in: 1.day) do
      Order.where(created_at: month.beginning_of_month..month.end_of_month)
           .sum(:total_amount)
    end
  end
end
```

### Cache Multiple Keys at Once

```ruby
# Write multiple
Rails.cache.write_multi({
  'key1' => 'value1',
  'key2' => 'value2'
}, expires_in: 1.hour)

# Read multiple
values = Rails.cache.read_multi('key1', 'key2')
# => { 'key1' => 'value1', 'key2' => 'value2' }

# Fetch multiple
Rails.cache.fetch_multi('user_1', 'user_2', expires_in: 1.hour) do |key|
  User.find(key.split('_').last)
end
```

### Increment/Decrement

```ruby
# Increment counter
Rails.cache.increment('page_views')
Rails.cache.increment('page_views', 5) # Increment by 5

# Decrement counter
Rails.cache.decrement('items_in_stock')
Rails.cache.decrement('items_in_stock', 3) # Decrement by 3
```

### Cache Existence Check

```ruby
if Rails.cache.exist?('expensive_calculation')
  result = Rails.cache.read('expensive_calculation')
else
  result = perform_expensive_calculation
  Rails.cache.write('expensive_calculation', result)
end
```

---

## SQL Caching

Rails automatically caches SQL queries within the same request.

```ruby
# First query hits database
User.where(active: true).to_a

# Second identical query in same request uses cache
User.where(active: true).to_a # Cached!

# Different request = new cache
```

### Uncached Queries

```ruby
# Force query to hit database
User.uncached do
  User.where(active: true).to_a # Always hits DB
end
```

### Clear Query Cache

```ruby
ActiveRecord::Base.connection.clear_query_cache
```

---

## HTTP Caching

Leverage browser and CDN caching using HTTP headers.

### ETag (Entity Tag)

```ruby
class ArticlesController < ApplicationController
  def show
    @article = Article.find(params[:id])
    
    # Generate ETag based on article
    fresh_when(@article)
    
    # Or with custom ETag
    fresh_when(etag: @article, last_modified: @article.updated_at)
  end
end
```

**How it works:**
1. Server sends ETag header with response
2. Browser stores ETag
3. Next request includes `If-None-Match` header
4. Server returns `304 Not Modified` if ETag matches

### Last-Modified

```ruby
class ArticlesController < ApplicationController
  def show
    @article = Article.find(params[:id])
    
    if stale?(last_modified: @article.updated_at)
      respond_to do |format|
        format.html
      end
    end
  end
end
```

### Combined ETag and Last-Modified

```ruby
def show
  @article = Article.find(params[:id])
  
  fresh_when(
    etag: [@article, current_user],
    last_modified: @article.updated_at,
    public: false
  )
end
```

### Cache-Control Headers

```ruby
# Public cache (CDN can cache)
expires_in 1.hour, public: true

# Private cache (only browser can cache)
expires_in 30.minutes, public: false

# No cache
expires_now

# Custom headers
response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
response.headers['Pragma'] = 'no-cache'
response.headers['Expires'] = '0'
```

### Conditional GET

```ruby
class Api::V1::ArticlesController < ApplicationController
  def show
    @article = Article.find(params[:id])
    
    if stale?(@article)
      render json: @article
    end
  end
end
```

---

## Russian Doll Caching

Nested fragment caching that automatically expires parent caches when children change.

### Basic Setup

```ruby
# app/models/article.rb
class Article < ApplicationRecord
  has_many :comments, dependent: :destroy
  belongs_to :author, class_name: 'User'
end

# app/models/comment.rb
class Comment < ApplicationRecord
  belongs_to :article, touch: true # Important!
end

# app/views/articles/show.html.erb
<% cache @article do %>
  <h1><%= @article.title %></h1>
  
  <div class="author">
    <% cache @article.author do %>
      <%= @article.author.name %>
    <% end %>
  </div>
  
  <div class="comments">
    <% cache ['comments', @article.comments.maximum(:updated_at)] do %>
      <%= render @article.comments %>
    <% end %>
  </div>
<% end %>

# app/views/comments/_comment.html.erb
<% cache comment do %>
  <p><%= comment.body %></p>
  <small><%= comment.created_at %></small>
<% end %>
```

### With `touch: true`

```ruby
class Comment < ApplicationRecord
  belongs_to :article, touch: true
  belongs_to :user, touch: true
end

class Article < ApplicationRecord
  belongs_to :author, class_name: 'User', touch: true
end

# When comment is updated:
# 1. comment.updated_at changes
# 2. article.updated_at changes (touch: true)
# 3. author.updated_at changes (touch: true)
# 4. All caches automatically expire
```

### Cache Digests

Rails automatically includes template digests in cache keys to bust cache when views change.

```ruby
# Template: app/views/articles/show.html.erb
<% cache @article do %>
  <%= render @article %>
<% end %>

# Generated cache key includes template digest:
# views/articles/123-20241126120000/7a1156131a6928cb0026877f8b749ac9

# When you modify the template, digest changes, cache auto-expires
```

### Explicit Cache Dependencies

```ruby
# app/views/articles/show.html.erb
<%# Template Dependency: articles/related %>
<% cache @article do %>
  <%= render partial: 'articles/related' %>
<% end %>
```

---

## Cache Stores

### Memory Store (Default for Development)

```ruby
# config/environments/development.rb
config.cache_store = :memory_store, { size: 64.megabytes }
```

**Pros:** Fast, no setup
**Cons:** Not shared between processes, limited size, cleared on restart

### File Store

```ruby
# config/environments/production.rb
config.cache_store = :file_store, Rails.root.join('tmp', 'cache')
```

**Pros:** Simple, persistent
**Cons:** Slower than memory, not shared between servers

### Memcached

```ruby
# Gemfile
gem 'dalli'

# config/environments/production.rb
config.cache_store = :mem_cache_store, 'cache-1.example.com', 'cache-2.example.com',
  {
    namespace: 'my_app',
    expires_in: 1.day,
    compress: true,
    pool_size: 5
  }
```

**Pros:** Fast, distributed, battle-tested
**Cons:** No persistence, LRU eviction

### Redis

```ruby
# Gemfile
gem 'redis'
gem 'hiredis'

# config/environments/production.rb
config.cache_store = :redis_cache_store, {
  url: ENV['REDIS_URL'],
  namespace: 'cache',
  expires_in: 90.minutes,
  pool_size: 5,
  pool_timeout: 5,
  reconnect_attempts: 3,
  error_handler: -> (method:, returning:, exception:) {
    Rails.logger.error("Redis error: #{exception}")
  }
}

# Or with Redis cluster
config.cache_store = :redis_cache_store, {
  cluster: [
    'redis://redis-1:6379/0',
    'redis://redis-2:6379/0',
    'redis://redis-3:6379/0'
  ],
  namespace: 'cache'
}
```

**Pros:** Fast, persistent, rich features (pub/sub, data structures)
**Cons:** More resource-intensive than Memcached

### Multi-Level Caching

```ruby
# Gemfile
gem 'readthis' # Redis client optimized for caching

# config/initializers/cache.rb
Rails.application.configure do
  # L1: Memory cache (fast, local)
  # L2: Redis cache (shared, persistent)
  
  memory_store = ActiveSupport::Cache::MemoryStore.new(size: 32.megabytes)
  redis_store = ActiveSupport::Cache::RedisCacheStore.new(
    url: ENV['REDIS_URL'],
    expires_in: 1.day
  )
  
  config.cache_store = ActiveSupport::Cache::CascadeStore.new([
    memory_store,
    redis_store
  ])
end
```

### Custom Cache Store

```ruby
# lib/cache_stores/custom_cache_store.rb
class CustomCacheStore < ActiveSupport::Cache::Store
  def read_entry(key, **options)
    # Custom read logic
  end
  
  def write_entry(key, entry, **options)
    # Custom write logic
  end
  
  def delete_entry(key, **options)
    # Custom delete logic
  end
end

# config/application.rb
config.cache_store = CustomCacheStore.new
```

---

## Cache Expiration Strategies

### Time-Based Expiration (TTL)

```ruby
# Explicit expiration
Rails.cache.fetch('key', expires_in: 1.hour) do
  expensive_operation
end

# Default expiration in cache store config
config.cache_store = :redis_cache_store, { expires_in: 1.day }
```

### Touch-Based Expiration

```ruby
class Comment < ApplicationRecord
  belongs_to :article, touch: true
end

# When comment updates, article.updated_at changes
# Cache key changes automatically
<% cache @article do %>
  <%= render @article %>
<% end %>
```

### Manual Expiration

```ruby
# Expire single key
Rails.cache.delete('user_count')

# Expire by pattern (Redis only)
Rails.cache.delete_matched('articles/*')

# Expire all
Rails.cache.clear
```

### Callback-Based Expiration

```ruby
class Article < ApplicationRecord
  after_save :clear_cache
  after_destroy :clear_cache
  
  private
  
  def clear_cache
    Rails.cache.delete(['articles', 'index'])
    Rails.cache.delete(['articles', id])
    Rails.cache.delete_matched('articles/trending*')
  end
end
```

### Sweepers (Legacy Pattern)

```ruby
# app/sweepers/article_sweeper.rb
class ArticleSweeper < ActionController::Caching::Sweeper
  observe Article
  
  def after_save(article)
    expire_cache_for(article)
  end
  
  def after_destroy(article)
    expire_cache_for(article)
  end
  
  private
  
  def expire_cache_for(article)
    expire_action controller: 'articles', action: 'index'
    expire_action controller: 'articles', action: 'show', id: article.id
  end
end
```

### Event-Based Expiration

```ruby
# app/models/article.rb
class Article < ApplicationRecord
  after_commit :broadcast_cache_invalidation, on: [:create, :update, :destroy]
  
  private
  
  def broadcast_cache_invalidation
    ActionCable.server.broadcast(
      'cache_invalidation',
      { model: 'Article', id: id }
    )
  end
end

# Subscriber in another service
ActionCable.server.on('cache_invalidation') do |data|
  Rails.cache.delete(["articles", data[:id]])
end
```

---

## Cache Invalidation

### The Two Hard Problems

> "There are only two hard things in Computer Science: cache invalidation and naming things." - Phil Karlton

### Strategy 1: Key-Based Expiration (Recommended)

```ruby
# Cache keys include timestamps
<% cache @article do %>
  # Cache key: articles/123-20241126120000
<% end %>

# When article updates, updated_at changes
# New cache key = automatic invalidation
```

### Strategy 2: Cache Sweeping

```ruby
class CacheSweeper
  def self.sweep_article(article_id)
    Rails.cache.delete("article_#{article_id}")
    Rails.cache.delete("article_#{article_id}_related")
    Rails.cache.delete_matched("articles/category_#{article.category_id}/*")
  end
end

# In model
after_save { CacheSweeper.sweep_article(id) }
```

### Strategy 3: Cache Tags (Redis)

```ruby
# Write with tags
Rails.cache.write('article_123', @article, tags: ['articles', 'category_5'])

# Invalidate by tag
Rails.cache.delete_by_tag('articles')
Rails.cache.delete_by_tag('category_5')
```

### Strategy 4: Version-Based

```ruby
class Article < ApplicationRecord
  def cache_key
    "articles/#{id}-v#{CACHE_VERSION}"
  end
end

# Bump version to invalidate all caches
CACHE_VERSION = 2
```

### Strategy 5: Background Jobs

```ruby
class InvalidateCacheJob < ApplicationJob
  queue_as :default
  
  def perform(cache_key)
    Rails.cache.delete(cache_key)
  end
end

# In model
after_commit do
  InvalidateCacheJob.perform_later("article_#{id}")
end
```

---

## Caching Best Practices

### 1. Cache High, Read Low

```ruby
# Good: Cache at controller/view level
def index
  @articles = Rails.cache.fetch('articles_index', expires_in: 1.hour) do
    Article.published.includes(:author).to_a
  end
end

# Avoid: Caching in models for every query
```

### 2. Use Namespaces

```ruby
Rails.cache.fetch("v1:users:#{user.id}:profile") do
  user.profile_data
end

# Easy to clear all v1 caches
Rails.cache.delete_matched("v1:*")
```

### 3. Cache Complex Calculations

```ruby
class Analytics
  def self.monthly_stats(month)
    Rails.cache.fetch("analytics:monthly:#{month}", expires_in: 1.week) do
      {
        revenue: calculate_revenue(month),
        users: count_users(month),
        conversion_rate: calculate_conversion(month)
      }
    end
  end
end
```

### 4. Don't Cache Everything

**Good candidates:**
- Expensive database queries
- API responses
- Complex calculations
- Rendered partials
- Static content

**Bad candidates:**
- User-specific data (unless keyed by user)
- Frequently changing data
- Small, fast queries
- Real-time data

### 5. Monitor Cache Hit Rates

```ruby
# config/initializers/cache_monitoring.rb
module CacheMonitoring
  def fetch(key, options = {}, &block)
    result = super
    
    if block_given? && !result.nil?
      Rails.logger.info("Cache HIT: #{key}")
      StatsD.increment('cache.hit')
    else
      Rails.logger.info("Cache MISS: #{key}")
      StatsD.increment('cache.miss')
    end
    
    result
  end
end

ActiveSupport::Cache::Store.prepend(CacheMonitoring)
```

### 6. Handle Cache Failures Gracefully

```ruby
def get_user_data(user_id)
  Rails.cache.fetch("user_#{user_id}", expires_in: 1.hour) do
    User.find(user_id).as_json
  end
rescue Redis::CannotConnectError
  # Fallback to database
  Rails.logger.error("Cache unavailable, fetching from database")
  User.find(user_id).as_json
end
```

### 7. Warm Up Caches

```ruby
# lib/tasks/cache.rake
namespace :cache do
  desc "Warm up critical caches"
  task warm_up: :environment do
    Article.trending # Populates cache
    Category.all.each do |category|
      category.popular_articles # Populates cache
    end
    
    puts "Cache warmed up successfully"
  end
end

# Run after deployment
# rails cache:warm_up
```

### 8. Use Consistent Cache Keys

```ruby
# Good: Use ActiveRecord's cache_key
cache @article

# Good: Structured keys
Rails.cache.fetch("users:#{user.id}:preferences")

# Bad: Inconsistent keys
Rails.cache.fetch("userPrefs_#{user.id}")
Rails.cache.fetch("user-#{user.id}-prefs")
```

---

## Performance Monitoring

### Cache Metrics to Track

```ruby
class CacheMetrics
  def self.log_fetch(key, hit)
    duration = Benchmark.realtime do
      yield if block_given?
    end
    
    StatsD.increment("cache.#{hit ? 'hit' : 'miss'}")
    StatsD.timing("cache.fetch.duration", duration * 1000)
    StatsD.gauge("cache.key.length", key.length)
  end
end
```

### Cache Statistics

```ruby
# Get cache stats (Redis)
info = Rails.cache.redis.info

puts "Used Memory: #{info['used_memory_human']}"
puts "Hit Rate: #{info['keyspace_hits']} / #{info['keyspace_misses']}"
puts "Evicted Keys: #{info['evicted_keys']}"
```

### Logging Cache Activity

```ruby
# config/environments/development.rb
config.log_level = :debug

# In logs you'll see:
# Cache read: articles/123-20241126120000
# Cache write: articles/123-20241126120000
# Cache fetch_hit: articles/123-20241126120000
```

### Performance Testing

```ruby
# test/performance/caching_test.rb
require 'test_helper'

class CachingPerformanceTest < ActionDispatch::PerformanceTest
  def test_article_index_with_cache
    Article.create(title: 'Test', content: 'Content')
    
    # First request (cache miss)
    get articles_path
    
    # Second request (cache hit) - should be faster
    get articles_path
  end
end
```

---

## Common Interview Questions

### 1. **What's the difference between fragment caching and low-level caching?**

Fragment caching is used in views to cache HTML partials. Low-level caching uses `Rails.cache` to cache data objects, calculations, or query results directly in code.

### 2. **How does Russian Doll caching work?**

It's nested fragment caching where child caches are embedded in parent caches. When a child changes (via `touch: true`), the parent's cache key changes automatically, invalidating the entire nested structure.

### 3. **What are the two hard problems in cache invalidation?**

Knowing when to invalidate (timing) and ensuring all related caches are invalidated (dependencies). Rails solves this with key-based expiration where cache keys include timestamps.

### 4. **When should you use Memcached vs Redis for caching?**

Memcached: Pure caching needs, LRU eviction acceptable, want simplicity and speed.
Redis: Need persistence, advanced data structures, pub/sub, or atomic operations.

### 5. **How do you handle cache stampedes?**

```ruby
# Problem: Many requests try to regenerate expensive cache simultaneously

# Solution 1: Race condition protection
Rails.cache.fetch('key', race_condition_ttl: 5.seconds) do
  expensive_operation
end

# Solution 2: Separate background job
if Rails.cache.exist?('key')
  Rails.cache.read('key')
else
  RefreshCacheJob.perform_later('key')
  fetch_from_database # Return stale data temporarily
end
```

### 6. **What is cache warming and when should you use it?**

Pre-populating caches before they're requested, typically after deployment or during low-traffic periods. Useful for expensive calculations or critical pages.

### 7. **How do you debug cache-related issues?**

```ruby
# Check if caching is enabled
Rails.application.config.action_controller.perform_caching

# Clear all caches
Rails.cache.clear

# Check cache in console
Rails.cache.read('key')
Rails.cache.fetch('key') { 'value' }

# Enable cache logging
config.log_level = :debug
```

### 8. **What's the cache key hierarchy in Rails?**

```ruby
# Model instance
cache @article
# => articles/123-20241126120000

# Collection with template dependency
cache [@article, @user]
# => articles/123-20241126120000/users/456-20241126110000

# Custom key with namespace
Rails.cache.fetch("v2:articles:#{article.id}")
# => v2:articles:123
```

---

## Cache Configuration Checklist

```ruby
# config/environments/production.rb

# ✅ Set appropriate cache store
config.cache_store = :redis_cache_store, { url: ENV['REDIS_URL'] }

# ✅ Enable caching
config.action_controller.perform_caching = true

# ✅ Set default expiration
config.cache_store = :redis_cache_store, { 
  expires_in: 1.day,
  namespace: "myapp_#{Rails.env}"
}

# ✅ Enable HTTP caching
config.action_dispatch.rack_cache = true

# ✅ Configure static asset caching
config.public_file_server.headers = {
  'Cache-Control' => 'public, max-age=31536000'
}

# ✅ Set up CDN
config.action_controller.asset_host = ENV['CDN_URL']
```

---

## Anti-Patterns to Avoid

### ❌ Caching User-Specific Data Without User Key

```ruby
# Bad
Rails.cache.fetch('dashboard_data') do
  current_user.dashboard_data
end

# Good
Rails.cache.fetch("dashboard_data:#{current_user.id}") do
  current_user.dashboard_data
end
```

### ❌ Infinite Cache Expiration

```ruby
# Bad
Rails.cache.fetch('key') do
  expensive_operation
end

# Good
Rails.cache.fetch('key', expires_in: 1.day) do
  expensive_operation
end
```

### ❌ Caching Entire Active Record Collections

```ruby
# Bad - Serializes entire AR objects
Rails.cache.fetch('articles') do
  Article.all.to_a
end

# Good - Cache serialized data
Rails.cache.fetch('articles') do
  Article.all.as_json
end
```

### ❌ Not Handling Cache Failures

```ruby
# Bad
Rails.cache.fetch('key') do
  critical_operation
end

# Good
begin
  Rails.cache.fetch('key') do
    critical_operation
  end
rescue Redis::CannotConnectError
  critical_operation # Fallback
end
```

---

## Resources

- [Rails Caching Guide](https://guides.rubyonrails.org/caching_with_rails.html)
- [Redis Best Practices](https://redis.io/topics/best-practices)
- [Memcached Wiki](https://github.com/memcached/memcached/wiki)
- [Cache Stampede Solutions](https://en.wikipedia.org/wiki/Cache_stampede)
- [HTTP Caching RFC](https://www.rfc-editor.org/rfc/rfc7234)

---

**Last Updated:** November


