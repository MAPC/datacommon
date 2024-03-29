Rails.application.routes.draw do
  resources :resources
  root 'pages#index'
  get '/ds', to: 'metadata#tabular'
  get '/gisdata', to: 'metadata#geospatial'
  get '/towndata', to: 'metadata#towndata'
  get '/shapefile', to: 'downloads#shapefile'
  get '/csv', to: 'downloads#csv'
  get '/gallery', to: 'pages#index'
  get '/gallery/*date', to: 'pages#index'
  get '/calendar/dogs', to: 'dogs#index'
  get '/calendar/*date', to: 'pages#index'
  get '/browser', to: 'pages#index'
  get '/browser/datasets/*dataset', to: 'pages#index'
  get '/browser/*selectedItems', to: 'pages#index'
  get '/profile/*muni/*tab', to: 'pages#index'
end
