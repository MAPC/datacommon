require 'net/http'
require 'uri'
require 'json'

class CalendarController < ApplicationController
  def dogs
    tokenUri = URI('https://api.petfinder.com/v2/oauth2/token')
    tokenRes = Net::HTTP.post_form(tokenUri, 'grant_type' => 'client_credentials', 'client_id' =>  ENV.fetch("PETFINDER_API_KEY"), 'client_secret' => ENV.fetch("PETFINDER_SECRET"))
    token = ActiveSupport::JSON.decode(tokenRes.body)["access_token"]
    puts token

    # Return JSON object
    render json: {'Fido': 'An ideal companion'}
  end
end