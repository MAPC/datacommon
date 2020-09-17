require 'net/http'
require 'uri'
require 'json'
require 'petfinder'

class CalendarController < ApplicationController
  def dogs
    allDogs = []
    Rails.cache.fetch('cachedDogs', expires_in: 1.hours) do
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
      allDogs
    end
    render json: Rails.cache.fetch('cachedDogs')
  end
end