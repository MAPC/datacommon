require 'rails_helper'

RSpec.describe "Data Browser", :type => :system do
  it "lets me pick datasets by category", js: true do
    visit "/browser"
    page.find("li[data-key='Clean Energy']").click
    page.find("li[data-key='MassSave']").click
    page.find("li[data-key='251']").click
    expect(page).to have_current_path('/browser/datasets/251')
  end
end
