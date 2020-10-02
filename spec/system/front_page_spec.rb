require 'rails_helper'

RSpec.describe 'Front Page', type: :system do
  it 'enables me to view the front page', js: true do
    visit '/'
    expect(page).to have_text('Data by category')
  end
end
