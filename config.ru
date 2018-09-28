require 'dotenv/load'
require 'rack'
require 'rack/cors'
require_relative 'app/geospatial_metadata'
require_relative 'app/tabular_metadata'
require_relative 'app/shapefile'
require_relative 'app/town_metadata'
require_relative 'app/csv'

use Rack::Cors do
  known_origins = [
    'http://localhost:4200',
    'http://staging.data-browser.mapc.org',
    'http://data-browser.mapc.org',
    'https://datacommon.mapc.org'
  ]

  allow do
    origins known_origins
    resource '*', :headers => :any, :methods => [:get]
  end
end

map '/gisdata' do
  run GeospatialMetadata::API.new
end

map '/ds' do
  run TabularMetadata::API.new
end

map '/towndata' do
  run TownMetadata::API.new
end

map '/shapefile' do
  run Shapefile::API.new
end

map '/csv' do
  run Csv::API.new
end
