Rails.application.routes.draw do
  resources :resources
  get '/calendars/:id', to: 'resources#calendars'
  root 'pages#index'
  get '/ds', to: 'metadata#tabular'
  get '/gisdata', to: 'metadata#geospatial'
  get '/towndata', to: 'metadata#towndata'
  get '/shapefile', to: 'downloads#shapefile'
  get '/csv', to: 'downloads#csv'
  get '/gallery', to: 'pages#index'
end
