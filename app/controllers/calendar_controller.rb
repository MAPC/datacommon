require 'net/http'
require 'uri'
require 'json'
require 'petfinder'

class CalendarController < ApplicationController
  def dogs
    petfinder = Petfinder::Client.new(ENV.fetch("PETFINDER_API_KEY"), ENV.fetch("PETFINDER_SECRET"))
    animals, pagination = petfinder.animals(type: 'dog', location: 'MA', page: 1, limit: 100)
    # puts animals
    puts pagination.total_pages

    # Return JSON object
    render json: animals
  end
end