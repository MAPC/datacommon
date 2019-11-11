require 'rails_helper'

RSpec.describe DownloadsController, type: :controller do

  describe "GET #shapefile" do
    it "returns http success" do
      get :shapefile
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET #csv" do
    it "returns http success" do
      get :csv
      expect(response).to have_http_status(:success)
    end
  end

end
