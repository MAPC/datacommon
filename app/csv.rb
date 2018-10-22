#!/usr/bin/env ruby
require 'active_record'
require 'active_support/core_ext/hash'
require 'yaml'
require 'nokogiri'
require 'rack'
require 'erb'

module Csv
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

    def to_csv(table_name, database_name)
      template = ERB.new File.new("config/settings.yml").read
      @settings = YAML.load template.result(binding)

      file_name = "#{table_name}.csv"
      arguments = []
      arguments << %Q(-c "\\copy (SELECT * FROM #{table_name}) to 'public/#{file_name}' with csv header")
      arguments << %Q(-w -h #{@settings['database']['host']} -p #{@settings['database']['port']} -U #{@settings['database']['username']} -d #{allowed_database_name(database_name)})
      arguments << %Q(> log/psql.log 2>&1)

      `psql #{arguments.join(" ")}`

      puts arguments.join(" ")

      return file_name
    end

    def response(request)
      if File.file?(Rack::Directory.new('public').root + "/#{request.params['table']}.csv")
        file = "#{request.params['table']}.csv"
      else
        file = to_csv(request.params['table'], request.params['database'])
      end
      [200, {'Content-Type' => 'text/csv', 'Content-Disposition' => "attachment;filename=\"#{request.params['table']}.csv\""}, FileStreamer.new("public/#{file}")]
    end

    def call(env)
      response(Rack::Request.new(env))
    end
  end
end
