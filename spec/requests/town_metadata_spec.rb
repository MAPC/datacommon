require "rails_helper"

RSpec.describe "serve town metadata", :type => :request do
  it "serves a web page with JSON" do
    get "/towndata?tables=brookline_zoning_base"
    parsed = JSON.parse(response.body)

    expect(parsed.keys).to eq(['brookline_zoning_base'])
  end
end
