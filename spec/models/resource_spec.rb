require 'rails_helper'

RSpec.describe Resource, type: :model do
  it 'creates an instance of the Resource model' do
    ActiveRecord::Base.connected_to(database: :primary) do
      resource = FactoryBot.create(:resource)
      expect(resource.title).to eq('MyPdf')
    end
  end

  it 'has an attached attachment' do
    ActiveRecord::Base.connected_to(database: :primary) do
      resource = FactoryBot.create(:resource)
      expect(resource.attachment.name).to eq('attachment')
    end
  end
end
