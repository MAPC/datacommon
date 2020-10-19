include ActionDispatch::TestProcess

FactoryBot.define do
  factory :resource do
    title { 'MyPdf' }
    url { 'http://www.pdf.com' }
    media_type { 'pdf' }
    description { 'this is a pdf file' }
    year_published { '2018' }
    month_published { 'Jan' }
    attachment { Rack::Test::UploadedFile.new(Rails.root.join('spec', 'fixtures', 'files', 'asdf.pdf'), 'document/pdf') }
  end
end
