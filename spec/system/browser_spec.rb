require 'rails_helper'

RSpec.describe "Data Browser", :type => :system do
  it "lets me pick datasets by category", js: true do
    visit "/browser"
    click_link 'Clean Energy'
    click_link 'MassSave'
    click_link 'MassSave Comm & Industrial Incentives and Savings (Municipal)'
    expect(page).to have_current_path('/browser/datasets/251')
  end
end
