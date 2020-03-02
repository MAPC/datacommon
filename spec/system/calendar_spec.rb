require 'rails_helper'

RSpec.describe "calendar", :type => :system do
  it "displays a bar chart for January", js: true do
    visit "/calendar/2020/january"
    expect(page).to have_css('svg')
  end

  it "displays a map for February", js: true do
    visit "/calendar/2020/february"
    page.within_frame('february-iframe') do
      expect(page).to have_css('.mapboxgl-canvas')
    end
    # within('.calendar-viz__iframe') { expect(page).to have_css('.mapboxgl-canvas') }
  end
end
