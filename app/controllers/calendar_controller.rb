require 'net/http'
require 'uri'
require 'json'
require 'petfinder'

class CalendarController < ApplicationController
  def dogs
    allDogs = []
    currentPage = 1
    petfinder = Petfinder::Client.new(ENV.fetch("PETFINDER_API_KEY"), ENV.fetch("PETFINDER_SECRET"))
    animals, pagination = petfinder.animals(type: 'dog', location: 'MA', page: currentPage, limit: 100)
    allDogs.push(*animals)
    
    loop do
      currentPage += 1
      nextAnimal, nextPagination = petfinder.animals(type: 'dog', location: 'MA', page: currentPage, limit: 100)
      allDogs.push(*nextAnimal)
      if currentPage > pagination.total_pages
        break
      end
    end

    # Return JSON object
    render json: allDogs
  end
end