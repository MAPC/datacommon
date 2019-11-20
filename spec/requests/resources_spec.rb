require "rails_helper"

RSpec.describe "resources controller", :type => :request do
  it "serves JSON data for a single resource" do
    ActiveRecord::Base.connected_to(database: :primary) do
      resource = FactoryBot.create(:resource)
      get "/resources/#{resource.id}.json"
      parsed = JSON.parse(response.body)

      expect(parsed).to include('resource')
    end
  end

  it 'attaches an uploaded file in a POST request' do
    ActiveRecord::Base.connected_to(database: :primary) do
      file = fixture_file_upload(Rails.root.join('spec', 'fixtures', 'files', 'asdf.pdf'), 'document/pdf')
      expect {
      post '/resources', params: { resource: { attachment: file } }
      }.to change(ActiveStorage::Attachment, :count).by(1)
    end
  end
end
