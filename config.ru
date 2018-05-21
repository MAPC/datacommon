require 'dotenv/load'
require 'rack'
require 'rack/cors'
require_relative 'app/geospatial_metadata'
require_relative 'app/tabular_metadata'

use Rack::Cors do
  known_origins = [
    'http://localhost:4200',
    'http://staging.data-browser.mapc.org',
    'http://data-browser.mapc.org',
  ]

  allow do
    origins known_origins
    resource '*', :headers => :any, :methods => [:get]
  end
end

map '/geospatial' do
  run GeospatialMetadata::API.new
end

map '/tabular' do
  run TabularMetadata::API.new
end
