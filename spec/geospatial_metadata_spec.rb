require "rack/test"
require_relative "../app/geospatial_metadata.rb"

RSpec.describe "serve gis metadata" do
  include Rack::Test::Methods

  def app
    Rack::Builder.new do
      map '/' do
        run GeospatialMetadata::API.new
      end
    end.to_app
  end

  it "serves a web page with JSON" do
    response = get "/:8080"
    expect(last_response).to be_ok
    expect(ActiveSupport::JSON.decode(last_response.body)).to_not be_nil
  end
end
