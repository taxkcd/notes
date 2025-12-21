# Rails Testing - Comprehensive Guide

## Table of Contents
- [Testing Frameworks Overview](#testing-frameworks-overview)
- [Unit Testing (Models)](#unit-testing-models)
- [Controller Testing](#controller-testing)
- [Request/Integration Testing](#requestintegration-testing)
- [System Testing](#system-testing)
- [View Testing](#view-testing)
- [Helper Testing](#helper-testing)
- [Mailer Testing](#mailer-testing)
- [Job Testing](#job-testing)
- [RSpec Best Practices](#rspec-best-practices)
- [Factory Bot](#factory-bot)
- [Fixtures vs Factories](#fixtures-vs-factories)
- [Mocking and Stubbing](#mocking-and-stubbing)
- [Test Coverage](#test-coverage)
- [Performance Testing](#performance-testing)

---

## Testing Frameworks Overview

### Minitest (Rails Default)

```ruby
# Gemfile (included by default)
gem 'minitest'

# test/test_helper.rb
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

class ActiveSupport::TestCase
  fixtures :all
end
```

### RSpec (Popular Alternative)

```ruby
# Gemfile
group :development, :test do
  gem 'rspec-rails', '~> 6.0'
end

# Install
rails generate rspec:install

# spec/rails_helper.rb
require 'spec_helper'
require_relative '../config/environment'
require 'rspec/rails'

RSpec.configure do |config|
  config.fixture_path = "#{::Rails.root}/spec/fixtures"
  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
end
```

### Comparison

| Feature | Minitest | RSpec |
|---------|----------|-------|
| Syntax | Ruby-like | DSL-based |
| Speed | Faster | Slightly slower |
| Community | Smaller | Large |
| Matchers | Basic | Extensive |
| Learning Curve | Easier | Steeper |

---

## Unit Testing (Models)

### Basic Model Tests (RSpec)

```ruby
# spec/models/article_spec.rb
require 'rails_helper'

RSpec.describe Article, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      article = Article.new(title: 'Test', content: 'Content', author: User.new)
      expect(article).to be_valid
    end
    
    it 'is invalid without a title' do
      article = Article.new(content: 'Content')
      expect(article).not_to be_valid
      expect(article.errors[:title]).to include("can't be blank")
    end
    
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:content) }
    it { should validate_length_of(:title).is_at_least(3).is_at_most(100) }
    it { should validate_uniqueness_of(:slug).case_insensitive }
  end
  
  describe 'associations' do
    it { should belong_to(:author).class_name('User') }
    it { should have_many(:comments).dependent(:destroy) }
    it { should have_many(:tags).through(:article_tags) }
  end
  
  describe 'scopes' do
    let!(:published_article) { create(:article, published: true) }
    let!(:draft_article) { create(:article, published: false) }
    
    describe '.published' do
      it 'returns only published articles' do
        expect(Article.published).to include(published_article)
        expect(Article.published).not_to include(draft_article)
      end
    end
    
    describe '.recent' do
      it 'returns articles in reverse chronological order' do
        older = create(:article, created_at: 2.days.ago)
        newer = create(:article, created_at: 1.day.ago)
        
        expect(Article.recent.first).to eq(newer)
      end
    end
  end
  
  describe 'instance methods' do
    describe '#publish!' do
      let(:article) { create(:article, published: false) }
      
      it 'sets published to true' do
        expect { article.publish! }.to change { article.published }.from(false).to(true)
      end
      
      it 'sets published_at timestamp' do
        expect { article.publish! }.to change { article.published_at }.from(nil)
      end
      
      it 'sends notification email' do
        expect { article.publish! }.to have_enqueued_job(ArticleNotificationJob)
      end
    end
    
    describe '#word_count' do
      it 'returns the number of words in content' do
        article = build(:article, content: 'This is a test article')
        expect(article.word_count).to eq(5)
      end
    end
  end
  
  describe 'callbacks' do
    describe 'before_save' do
      it 'generates slug from title' do
        article = create(:article, title: 'Test Article')
        expect(article.slug).to eq('test-article')
      end
    end
    
    describe 'after_create' do
      it 'increments author post count' do
        author = create(:user, posts_count: 0)
        expect {
          create(:article, author: author)
        }.to change { author.reload.posts_count }.by(1)
      end
    end
  end
end
```

### Basic Model Tests (Minitest)

```ruby
# test/models/article_test.rb
require 'test_helper'

class ArticleTest < ActiveSupport::TestCase
  test 'should not save article without title' do
    article = Article.new(content: 'Content')
    assert_not article.save
    assert_includes article.errors[:title], "can't be blank"
  end
  
  test 'should save article with valid attributes' do
    article = Article.new(
      title: 'Test',
      content: 'Content',
      author: users(:john)
    )
    assert article.save
  end
  
  test 'published scope returns only published articles' do
    published = articles(:published_one)
    draft = articles(:draft_one)
    
    assert_includes Article.published, published
    assert_not_includes Article.published, draft
  end
  
  test 'publish! sets published to true' do
    article = articles(:draft_one)
    article.publish!
    
    assert article.published
    assert_not_nil article.published_at
  end
end
```

### Testing Complex Business Logic

```ruby
# spec/models/order_spec.rb
RSpec.describe Order, type: :model do
  describe '#calculate_total' do
    let(:order) { create(:order) }
    let!(:item1) { create(:order_item, order: order, price: 10.00, quantity: 2) }
    let!(:item2) { create(:order_item, order: order, price: 15.00, quantity: 1) }
    
    context 'without discount' do
      it 'calculates correct total' do
        expect(order.calculate_total).to eq(35.00)
      end
    end
    
    context 'with percentage discount' do
      before { order.update(discount_type: 'percentage', discount_value: 10) }
      
      it 'applies percentage discount' do
        expect(order.calculate_total).to eq(31.50) # 35 - 10%
      end
    end
    
    context 'with fixed discount' do
      before { order.update(discount_type: 'fixed', discount_value: 5) }
      
      it 'applies fixed discount' do
        expect(order.calculate_total).to eq(30.00) # 35 - 5
      end
    end
    
    context 'with tax' do
      before { order.update(tax_rate: 0.08) }
      
      it 'includes tax in total' do
        expect(order.calculate_total).to eq(37.80) # 35 * 1.08
      end
    end
  end
  
  describe 'state machine' do
    let(:order) { create(:order, state: 'pending') }
    
    it 'transitions from pending to processing' do
      expect { order.process! }.to change { order.state }
        .from('pending').to('processing')
    end
    
    it 'transitions from processing to shipped' do
      order.update(state: 'processing')
      expect { order.ship! }.to change { order.state }
        .from('processing').to('shipped')
    end
    
    it 'cannot transition from pending to shipped' do
      expect { order.ship! }.to raise_error(StateMachines::InvalidTransition)
    end
  end
end
```

### Testing Database Constraints

```ruby
RSpec.describe User, type: :model do
  describe 'database constraints' do
    it 'enforces email uniqueness at database level' do
      create(:user, email: 'test@example.com')
      
      expect {
        User.create!(email: 'test@example.com', skip_validation: true)
      }.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end
end
```

---

## Controller Testing

### Basic Controller Tests (RSpec)

```ruby
# spec/controllers/articles_controller_spec.rb
require 'rails_helper'

RSpec.describe ArticlesController, type: :controller do
  let(:user) { create(:user) }
  let(:article) { create(:article, author: user) }
  
  before { sign_in user }
  
  describe 'GET #index' do
    it 'returns success response' do
      get :index
      expect(response).to be_successful
      expect(response).to have_http_status(200)
    end
    
    it 'assigns @articles' do
      article1 = create(:article)
      article2 = create(:article)
      
      get :index
      expect(assigns(:articles)).to match_array([article1, article2])
    end
    
    it 'renders the index template' do
      get :index
      expect(response).to render_template(:index)
    end
  end
  
  describe 'GET #show' do
    it 'returns success response' do
      get :show, params: { id: article.id }
      expect(response).to be_successful
    end
    
    it 'assigns the requested article to @article' do
      get :show, params: { id: article.id }
      expect(assigns(:article)).to eq(article)
    end
    
    context 'when article does not exist' do
      it 'raises RecordNotFound' do
        expect {
          get :show, params: { id: 'invalid' }
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
  
  describe 'POST #create' do
    context 'with valid parameters' do
      let(:valid_attributes) do
        { title: 'New Article', content: 'Content here' }
      end
      
      it 'creates a new article' do
        expect {
          post :create, params: { article: valid_attributes }
        }.to change(Article, :count).by(1)
      end
      
      it 'redirects to the created article' do
        post :create, params: { article: valid_attributes }
        expect(response).to redirect_to(Article.last)
      end
      
      it 'sets a flash message' do
        post :create, params: { article: valid_attributes }
        expect(flash[:notice]).to eq('Article was successfully created.')
      end
    end
    
    context 'with invalid parameters' do
      let(:invalid_attributes) { { title: '' } }
      
      it 'does not create a new article' do
        expect {
          post :create, params: { article: invalid_attributes }
        }.not_to change(Article, :count)
      end
      
      it 'renders the new template' do
        post :create, params: { article: invalid_attributes }
        expect(response).to render_template(:new)
      end
    end
  end
  
  describe 'PATCH #update' do
    context 'with valid parameters' do
      let(:new_attributes) { { title: 'Updated Title' } }
      
      it 'updates the article' do
        patch :update, params: { id: article.id, article: new_attributes }
        article.reload
        expect(article.title).to eq('Updated Title')
      end
      
      it 'redirects to the article' do
        patch :update, params: { id: article.id, article: new_attributes }
        expect(response).to redirect_to(article)
      end
    end
    
    context 'with invalid parameters' do
      it 'does not update the article' do
        patch :update, params: { id: article.id, article: { title: '' } }
        article.reload
        expect(article.title).not_to eq('')
      end
    end
  end
  
  describe 'DELETE #destroy' do
    it 'destroys the article' do
      article # create the article
      expect {
        delete :destroy, params: { id: article.id }
      }.to change(Article, :count).by(-1)
    end
    
    it 'redirects to articles index' do
      delete :destroy, params: { id: article.id }
      expect(response).to redirect_to(articles_url)
    end
  end
  
  describe 'authorization' do
    context 'when user is not the author' do
      let(:other_user) { create(:user) }
      let(:other_article) { create(:article, author: other_user) }
      
      it 'denies access to edit' do
        get :edit, params: { id: other_article.id }
        expect(response).to redirect_to(root_path)
        expect(flash[:alert]).to eq('Not authorized')
      end
      
      it 'denies access to update' do
        patch :update, params: { id: other_article.id, article: { title: 'Hacked' } }
        expect(response).to redirect_to(root_path)
      end
    end
  end
end
```

### Controller Tests (Minitest)

```ruby
# test/controllers/articles_controller_test.rb
require 'test_helper'

class ArticlesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @article = articles(:one)
    @user = users(:john)
    sign_in @user
  end
  
  test 'should get index' do
    get articles_url
    assert_response :success
  end
  
  test 'should create article' do
    assert_difference('Article.count', 1) do
      post articles_url, params: { 
        article: { title: 'New', content: 'Content' } 
      }
    end
    
    assert_redirected_to article_url(Article.last)
  end
  
  test 'should not create article with invalid params' do
    assert_no_difference('Article.count') do
      post articles_url, params: { article: { title: '' } }
    end
    
    assert_response :unprocessable_entity
  end
  
  test 'should update article' do
    patch article_url(@article), params: { 
      article: { title: 'Updated' } 
    }
    
    @article.reload
    assert_equal 'Updated', @article.title
  end
  
  test 'should destroy article' do
    assert_difference('Article.count', -1) do
      delete article_url(@article)
    end
    
    assert_redirected_to articles_url
  end
end
```

---

## Request/Integration Testing

Request specs test the full stack from routing to response.

```ruby
# spec/requests/api/v1/articles_spec.rb
require 'rails_helper'

RSpec.describe 'Api::V1::Articles', type: :request do
  let(:user) { create(:user) }
  let(:auth_headers) { { 'Authorization' => "Bearer #{user.auth_token}" } }
  
  describe 'GET /api/v1/articles' do
    let!(:articles) { create_list(:article, 3) }
    
    before { get '/api/v1/articles', headers: auth_headers }
    
    it 'returns articles' do
      expect(response).to have_http_status(200)
      expect(JSON.parse(response.body).size).to eq(3)
    end
    
    it 'returns correct JSON structure' do
      json = JSON.parse(response.body)
      
      expect(json.first).to include(
        'id',
        'title',
        'content',
        'author'
      )
    end
    
    context 'with pagination' do
      before { create_list(:article, 15) }
      
      it 'returns paginated results' do
        get '/api/v1/articles', params: { page: 1, per_page: 10 }
        
        expect(JSON.parse(response.body).size).to eq(10)
      end
      
      it 'includes pagination metadata' do
        get '/api/v1/articles', params: { page: 2, per_page: 10 }
        
        json = JSON.parse(response.body)
        expect(response.headers['X-Total-Count']).to eq('18')
        expect(response.headers['X-Total-Pages']).to eq('2')
      end
    end
    
    context 'with search' do
      let!(:searchable) { create(:article, title: 'Searchable Article') }
      
      it 'filters by search query' do
        get '/api/v1/articles', params: { q: 'Searchable' }
        
        json = JSON.parse(response.body)
        expect(json.size).to eq(1)
        expect(json.first['id']).to eq(searchable.id)
      end
    end
  end
  
  describe 'POST /api/v1/articles' do
    let(:valid_params) do
      {
        article: {
          title: 'New Article',
          content: 'Article content'
        }
      }
    end
    
    context 'with valid parameters' do
      it 'creates a new article' do
        expect {
          post '/api/v1/articles', 
               params: valid_params,
               headers: auth_headers
        }.to change(Article, :count).by(1)
      end
      
      it 'returns 201 status' do
        post '/api/v1/articles', 
             params: valid_params,
             headers: auth_headers
        
        expect(response).to have_http_status(201)
      end
      
      it 'returns created article' do
        post '/api/v1/articles', 
             params: valid_params,
             headers: auth_headers
        
        json = JSON.parse(response.body)
        expect(json['title']).to eq('New Article')
      end
      
      it 'returns location header' do
        post '/api/v1/articles', 
             params: valid_params,
             headers: auth_headers
        
        expect(response.headers['Location']).to match(/\/api\/v1\/articles\/\d+/)
      end
    end
    
    context 'with invalid parameters' do
      let(:invalid_params) do
        { article: { title: '' } }
      end
      
      it 'does not create article' do
        expect {
          post '/api/v1/articles',
               params: invalid_params,
               headers: auth_headers
        }.not_to change(Article, :count)
      end
      
      it 'returns 422 status' do
        post '/api/v1/articles',
             params: invalid_params,
             headers: auth_headers
        
        expect(response).to have_http_status(422)
      end
      
      it 'returns error messages' do
        post '/api/v1/articles',
             params: invalid_params,
             headers: auth_headers
        
        json = JSON.parse(response.body)
        expect(json['errors']).to be_present
      end
    end
    
    context 'without authentication' do
      it 'returns 401 status' do
        post '/api/v1/articles', params: valid_params
        expect(response).to have_http_status(401)
      end
    end
  end
  
  describe 'PATCH /api/v1/articles/:id' do
    let(:article) { create(:article, author: user) }
    let(:update_params) do
      { article: { title: 'Updated Title' } }
    end
    
    it 'updates the article' do
      patch "/api/v1/articles/#{article.id}",
            params: update_params,
            headers: auth_headers
      
      article.reload
      expect(article.title).to eq('Updated Title')
    end
    
    it 'returns 200 status' do
      patch "/api/v1/articles/#{article.id}",
            params: update_params,
            headers: auth_headers
      
      expect(response).to have_http_status(200)
    end
    
    context 'when user is not the author' do
      let(:other_article) { create(:article) }
      
      it 'returns 403 status' do
        patch "/api/v1/articles/#{other_article.id}",
              params: update_params,
              headers: auth_headers
        
        expect(response).to have_http_status(403)
      end
    end
  end
  
  describe 'DELETE /api/v1/articles/:id' do
    let!(:article) { create(:article, author: user) }
    
    it 'deletes the article' do
      expect {
        delete "/api/v1/articles/#{article.id}", headers: auth_headers
      }.to change(Article, :count).by(-1)
    end
    
    it 'returns 204 status' do
      delete "/api/v1/articles/#{article.id}", headers: auth_headers
      expect(response).to have_http_status(204)
    end
  end
end
```

### Testing Authentication Flow

```ruby
# spec/requests/authentication_spec.rb
RSpec.describe 'Authentication', type: :request do
  let(:user) { create(:user, password: 'password123') }
  
  describe 'POST /login' do
    context 'with valid credentials' do
      it 'returns authentication token' do
        post '/login', params: {
          email: user.email,
          password: 'password123'
        }
        
        expect(response).to have_http_status(200)
        json = JSON.parse(response.body)
        expect(json['token']).to be_present
        expect(json['user']['email']).to eq(user.email)
      end
    end
    
    context 'with invalid credentials' do
      it 'returns error' do
        post '/login', params: {
          email: user.email,
          password: 'wrong'
        }
        
        expect(response).to have_http_status(401)
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Invalid credentials')
      end
    end
  end
  
  describe 'POST /logout' do
    let(:auth_headers) { { 'Authorization' => "Bearer #{user.auth_token}" } }
    
    it 'invalidates token' do
      post '/logout', headers: auth_headers
      
      expect(response).to have_http_status(200)
      
      # Try using invalidated token
      get '/api/v1/articles', headers: auth_headers
      expect(response).to have_http_status(401)
    end
  end
end
```

---

## System Testing

System tests use a real browser (headless Chrome) to test the entire application.

```ruby
# Gemfile
group :test do
  gem 'capybara'
  gem 'selenium-webdriver'
end

# spec/rails_helper.rb
require 'capybara/rails'
require 'selenium-webdriver'

Capybara.register_driver :headless_chrome do |app|
  options = Selenium::WebDriver::Chrome::Options.new
  options.add_argument('--headless')
  options.add_argument('--no-sandbox')
  options.add_argument('--disable-dev-shm-usage')
  
  Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
end

Capybara.javascript_driver = :headless_chrome

# spec/system/articles_spec.rb
require 'rails_helper'

RSpec.describe 'Articles', type: :system do
  let(:user) { create(:user) }
  
  before do
    driven_by(:headless_chrome)
    login_as(user)
  end
  
  describe 'Creating an article' do
    it 'allows user to create an article' do
      visit new_article_path
      
      fill_in 'Title', with: 'My New Article'
      fill_in 'Content', with: 'This is the content'
      click_button 'Create Article'
      
      expect(page).to have_content('Article was successfully created')
      expect(page).to have_content('My New Article')
      expect(page).to have_content('This is the content')
    end
    
    it 'shows validation errors' do
      visit new_article_path
      
      click_button 'Create Article'
      
      expect(page).to have_content("Title can't be blank")
      expect(page).to have_content("Content can't be blank")
    end
  end
  
  describe 'Editing an article' do
    let!(:article) { create(:article, author: user, title: 'Original Title') }
    
    it 'allows user to edit their article' do
      visit edit_article_path(article)
      
      fill_in 'Title', with: 'Updated Title'
      click_button 'Update Article'
      
      expect(page).to have_content('Article was successfully updated')
      expect(page).to have_content('Updated Title')
    end
  end
  
  describe 'Deleting an article' do
    let!(:article) { create(:article, author: user) }
    
    it 'allows user to delete their article', js: true do
      visit article_path(article)
      
      accept_confirm do
        click_link 'Delete'
      end
      
      expect(page).to have_content('Article was successfully deleted')
      expect(page).not_to have_content(article.title)
    end
  end
  
  describe 'Search functionality' do
    let!(:article1) { create(:article, title: 'Ruby on Rails') }
    let!(:article2) { create(:article, title: 'JavaScript Guide') }
    
    it 'filters articles by search term' do
      visit articles_path
      
      fill_in 'Search', with: 'Ruby'
      click_button 'Search'
      
      expect(page).to have_content('Ruby on Rails')
      expect(page).not_to have_content('JavaScript Guide')
    end
  end
  
  describe 'JavaScript interactions', js: true do
    let!(:article) { create(:article) }
    
    it 'allows inline editing' do
      visit article_path(article)
      
      find('.edit-inline').click
      fill_in 'article_title', with: 'Edited via JS'
      find('.save-inline').click
      
      expect(page).to have_content('Edited via JS')
    end
    
    it 'shows modal on delete' do
      visit article_path(article)
      
      click_link 'Delete'
      
      within('.modal') do
        expect(page).to have_content('Are you sure?')
      end
    end
  end
end
```

---

## View Testing

```ruby
# spec/views/articles/show.html.erb_spec.rb
require 'rails_helper'

RSpec.describe 'articles/show.html.erb', type: :view do
  let(:article) do
    create(:article,
      title: 'Test Article',
      content: 'Test Content',
      published_at: Time.zone.now
    )
  end
  
  before do
    assign(:article, article)
    render
  end
  
  it 'displays the article title' do
    expect(rendered).to have_content('Test Article')
  end
  
  it 'displays the article content' do
    expect(rendered).to have_content('Test Content')
  end
  
  it 'displays published date' do
    expect(rendered).to have_content(article.published_at.strftime('%B %d, %Y'))
  end
  
  it 'shows edit link for author' do
    assign(:current_user, article.author)
    render
    
    expect(rendered).to have_link('Edit', href: edit_article_path(article))
  end
  
  it 'does not show edit link for non-author' do
    assign(:current_user, create(:user))
    render
    
    expect(rendered).not_to have_link('Edit')
  end
end
```

---

## Helper Testing

```ruby
# spec/helpers/articles_helper_spec.rb
require 'rails_helper'

RSpec.describe ArticlesHelper, type: :helper do
  describe '#formatted_date' do
    it 'formats date correctly' do
      date = Time.zone.parse('2024-11-26 10:30:00')
      expect(helper.formatted_date(date)).to eq('November 26, 2024')
    end
    
    it 'returns nil for nil date' do
      expect(helper.formatted_date(nil)).to be_nil
    end
  end
  
  describe '#article_status_badge' do
    it 'returns published badge for published article' do
      article = build(:article, published: true)
      expect(helper.article_status_badge(article)).to include('badge-success')
      expect(helper.article_status_badge(article)).to include('Published')
    end
    
    it 'returns draft badge for unpublished article' do
      article = build(:article, published: false)
      expect(helper.article_status_badge(article)).to include('badge-secondary')
      expect(helper.article_status_badge(article)).to include('Draft')
    end
  end
  
  describe '#truncate_html' do
    it 'truncates HTML content' do
      html = '<p>This is a long piece of content</p>'
      result = helper.truncate_html(html, length: 10)
      
      expect(result).to eq('<p>This is a...</p>')
    end
  end
end
```

---

## Mailer Testing

```ruby
# spec/mailers/user_mailer_spec.rb
require 'rails_helper'

RSpec.describe UserMailer, type: :mailer do
  describe 'welcome_email' do
    let(:user) { create(:user, email: 'user@example.co

```


