source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.6.5'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 6.0.1'
# Use postgresql as the database for Active Record
gem 'pg', '>= 0.18', '< 2.0'
# Use Puma as the app server
gem 'puma', '~> 4.3'
# Use rack-cors to set appropriate headers
gem 'rack-cors', require: 'rack/cors'
# Use SCSS for stylesheets
gem 'sass-rails', '>= 6'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker', '~> 4.0'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.2', require: false

gem 'faraday'
gem 'rubyzip'

gem 'aws-sdk-s3', require: false
gem 'mini_magick'
gem 'non-digest-assets'
gem 'petfinder'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'web-console', '>= 3.3.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

group :development, :test do
  gem 'dotenv-rails'
  gem 'factory_bot_rails'
  gem 'pry-byebug'
  gem 'pry-rails'
  gem 'rails-controller-testing'
  gem 'rspec-rails'
end

group :development do
  gem 'capistrano', '~> 3.10', require: false
  gem 'capistrano-bundler'
  gem 'capistrano-passenger'
  gem 'capistrano-rails', '~> 1.3', require: false
  gem 'capistrano-rvm'
  gem 'guard'
  gem 'guard-livereload'
  gem 'guard-rspec'
  gem 'rb-fsevent'
  gem 'spring-commands-rspec'
  gem 'terminal-notifier-guard'
end

group :test do
  gem 'axe-matchers'
  gem 'capybara'
  gem 'capybara-screenshot'
  gem 'parallel'
  gem 'selenium-webdriver'
end
