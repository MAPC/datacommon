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
  end

  it "displays basemap in March visualization", js: true do
    visit "/calendar/2020/march"
    expect(page).to have_css('.d3-map__mapc > path', count: 101)
  end

  it "renders g elements for each year in the March visualization", js: true do
    visit "/calendar/2020/march"
    expect(page).to have_css('.d3-map__points', visible: false)
  end

  it "displays a map for April", js: true do
    visit "/calendar/2020/april"
    expect(page).to have_css('.mapboxgl-canvas')
  end

  it "displays a map for May", js: true do
    visit "/calendar/2020/may"
    expect(page).to have_css('.mapboxgl-canvas')
  end

  it "displays a bar chart for June", js: true do
    visit "/calendar/2020/june"
    expect(page).to have_css('svg')
  end

  it "displays a map for July", js: true do
    visit "/calendar/2020/july"
    page.within_frame('july-iframe') do
      expect(page).to have_css('.mapboxgl-canvas')
    end
  end

  it "displays a map for August", js: true do
    visit "/calendar/2020/august"
    page.within_frame('august-iframe') do
      expect(page).to have_css('.mapboxgl-canvas')
    end
  end

  it "displays a map for September", js: true do
    visit "/calendar/2020/september"
    page.within_frame('september-iframe') do
      expect(page).to have_css('.mapboxgl-canvas')
    end
  end

  it "displays a map for October", js: true do
    visit "/calendar/2020/october"
    page.within_frame('october-iframe') do
      expect(page).to have_css('.mapboxgl-canvas')
    end
  end
end
