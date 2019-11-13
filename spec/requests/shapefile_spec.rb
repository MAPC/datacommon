require "rails_helper"

RSpec.describe "downloads a shapefile", :type => :request do
  it "serves a zip file" do
    get "/shapefile?table=towndata.mapc.Brookline_zoning_base&database=towndata"

    expect(response.headers["Content-Type"]).to eq('application/zip')
  end
end
