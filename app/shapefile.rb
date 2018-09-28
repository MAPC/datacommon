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
    def allowed_database_name(database_name)
      ['ds', 'gisdata', 'towndata'].include?(database_name) ? database_name : nil
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

    def to_shp(table_name, database_name)
      template = ERB.new File.new("config/settings.yml").read
      @settings = YAML.load template.result(binding)

      file_name = "export-#{table_name}-#{Time.now.to_i}"
      arguments = []
      arguments << %Q(-f 'ESRI Shapefile' public/#{file_name}.shp)
      arguments << %Q(PG:'host=#{@settings['database']['host']} port=#{@settings['database']['port']} user=#{@settings['database']['username']} dbname=#{allowed_database_name(database_name)} password=#{@settings['database']['password']}')
      arguments << %Q(-sql 'SELECT *,sde.ST_AsText(shape) FROM #{table_name}' -skipfailures)

      `ogr2ogr #{arguments.join(" ")}`

      return file_name
    end

    def response(request)
      file = zip(to_shp(request.params['table'],request.params['database']))
      [200, {'Content-Type' => 'application/zip', 'Content-Disposition' => "attachment; filename=\"#{request.params['table']}.zip\""}, FileStreamer.new("public/#{file}")]
    end

    def call(env)
      response(Rack::Request.new(env))
    end
  end
end
