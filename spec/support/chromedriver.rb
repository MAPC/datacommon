require 'selenium/webdriver'
require 'capybara-screenshot/rspec'
Capybara.javascript_driver = :selenium_chrome_headless

Capybara::Screenshot.register_driver(:selenium_chrome_headless) do |driver, path|
  driver.browser.save_screenshot(path)
end
