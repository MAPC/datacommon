require 'rails_helper'

RSpec.describe "calendar", :type => :system do
  it "displays a bar chart for January", js: true do
    visit "/calendar/2020/january"
    expect(page).to have_css('svg')
  end
end
