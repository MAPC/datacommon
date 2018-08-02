#!/usr/bin/env ruby
require 'active_record'
require 'active_support/core_ext/hash'
require 'yaml'
require 'nokogiri'
require 'rack'
require 'erb'
require 'pry-byebug'
require 'zip'

module Shapefile
  class FileStreamer
    def initialize(path)
      @file = File.open(path)
    end

    def each(&blk)
      @file.each(&blk)
    ensure
      @file.close
    end
  end

  class API
    def connect_to_gis_database
      template = ERB.new File.new("config/settings.yml").read
      @settings = YAML.load template.result(binding)

      ActiveRecord::Base.establish_connection(
        adapter:  'postgresql',
        host: @settings['database']['host'],
        port: @settings['database']['port'],
        database: @settings['database']['geospatial']['database'],
        username: @settings['database']['username'],
        password: @settings['database']['password'],
        schema_search_path: @settings['database']['geospatial']['schema']['metadata']
      )
    end

    def zip(file_name)
      Zip::File.open("public/#{file_name}.zip", Zip::File::CREATE) do |zipfile|
        zipfile.add("#{file_name}.prj", "public/26986.prj")
        zipfile.add("#{file_name}.shp", "public/#{file_name}.shp")
        zipfile.add("#{file_name}.shx", "public/#{file_name}.shx")
        zipfile.add("#{file_name}.dbf", "public/#{file_name}.dbf")
      end
      return "#{file_name}.zip"
    end

    def to_shp(table_name)
      template = ERB.new File.new("config/settings.yml").read
      @settings = YAML.load template.result(binding)

      file_name = "export-#{Time.now.to_i}"
      arguments = []
      arguments << %Q(-f 'ESRI Shapefile' public/#{file_name}.shp)
      arguments << %Q(PG:'host=#{@settings['database']['host']} port=#{@settings['database']['port']} user=#{@settings['database']['username']} dbname=#{@settings['database']['geospatial']['database']} password=#{@settings['database']['password']}')
      arguments << %Q(-sql 'SELECT *,sde.ST_AsText(shape) FROM #{@settings['database']['geospatial']['schema']['data']}.#{table_name}' -skipfailures)

      `ogr2ogr #{arguments.join(" ")}`

      return file_name
    end

    def response(request)
      connect_to_gis_database
      file = zip(to_shp(request.params['table']))
      [200, {'Content-Type' => 'application/zip'}, FileStreamer.new("public/#{file}")]
    end

    def call(env)
      response(Rack::Request.new(env))
    end
  end
end
