Rails.application.routes.draw do
  get '/ds', to: 'metadata#tabular'
  get '/gisdata', to: 'metadata#geospatial'
  get '/towndata', to: 'metadata#towndata'
  get '/shapefile', to: 'downloads#shapefile'
  get '/csv', to: 'downloads#csv'
end
