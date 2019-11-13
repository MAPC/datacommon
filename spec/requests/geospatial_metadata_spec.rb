require "rails_helper"

RSpec.describe "serve geospatial metadata", :type => :request do
  it "serves a web page with JSON" do
    get "/gisdata?tables=ma_parcels_metrofuture"
    parsed = JSON.parse(response.body)

    expect(parsed.keys).to eq(['ma_parcels_metrofuture'])
  end
end
