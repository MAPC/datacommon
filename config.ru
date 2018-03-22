require_relative 'app/geospatial_metadata'
require_relative 'app/tabular_metadata'
map '/geospatial' do
  run GeospatialMetadata::API.new
end

map '/tabular' do
  run TabularMetadata::API.new
end
