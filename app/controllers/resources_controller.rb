require 'digest/md5'

class ResourcesController < ApplicationController
before_action :set_resource, only: [:edit, :update, :show, :destroy]
skip_before_action :verify_authenticity_token

  def index
    @resources = Resource.all

    respond_to do |f|
      f.html
      f.json { render 'resources/index.json.jbuilder' }
    end
  end

  def show
    if @resource.attachment.previewable?
      @image_thumbnail = @resource.attachment&.preview(resize: params["image_size"] || "300x300")
    end

    respond_to do |f|
      f.html { render :show }
      f.json { render 'resources/show.json.jbuilder' }
    end
  end

  def new
    @resource = Resource.new
  end

  def create
    @resource = Resource.new(resource_params)
    if @resource.save
      respond_to do |f|
        f.html { redirect_to resources_path }
        f.json { render json: @resource }
      end
    else
      flash[:notice] = "Resource not created."
      render :new
    end
  end

  def edit
  end

  def update
    @resource.update(resource_params)

    respond_to do |f|
      f.html { redirect_to resource_path(@resource) }
      f.json { render json: @resource }
    end
  end

  def destroy
    @resource.destroy
    redirect_to resources_path
  end

  def calendars
    render "/calendars/#{params[:id]}"
  end

  private
  def set_resource
    @resource = Resource.find(params[:id])
  end

  def resource_params
    params.require(:resource).permit(:title, :url, :media_type, :description, :year_published, :month_published, :attachment)
  end
end
