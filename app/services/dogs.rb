require 'petfinder'

class Dogs
  def initialize; end

  def execute
    all_dogs = []
    Rails.cache.fetch('cachedDogs', expires_in: 1.hours) do
      current_page = 1
      petfinder = Petfinder::Client.new(Rails.application.credentials.petfinder[:api_key], Rails.application.credentials.petfinder[:secret])
      animals, pagination = petfinder.animals(type: 'dog', location: 'MA', page: current_page, limit: 100)
      all_dogs.push(*animals)

      loop do
        current_page += 1
        next_animal, _next_pagination = petfinder.animals(type: 'dog', location: 'MA', page: current_page, limit: 100)
        all_dogs.push(*next_animal)
        break if current_page > pagination.total_pages
      end
      all_dogs
    end
    Rails.cache.fetch('cachedDogs')
  end
end
