class DogsController < ApplicationController
  def index
    render json: Dogs.new.execute
  end
end
