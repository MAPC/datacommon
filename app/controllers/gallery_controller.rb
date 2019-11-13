class GalleryController < ApplicationController

    def tabular
      render json: TabularMetadata.new(metadata_params).execute
    end
  
    def geospatial
      render json: GeospatialMetadata.new(metadata_params).execute
    end
  
    def towndata
      render json: TownMetadata.new(metadata_params).execute
    end
  
    def shapefile
      render json: ShapefileMetadata.new(metadata_params).execute
    end
  
    private
  
    def metadata_params
      params.permit(:tables, :columns, :subset)
    end
  end
  