#!/usr/bin/env ruby
require 'active_record'
require 'active_support/core_ext/hash'
require 'yaml'
require 'nokogiri'
require 'rack'
require 'erb'
require 'pry-byebug'

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
    def to_csv(table_name)
      template = ERB.new File.new("config/settings.yml").read
      @settings = YAML.load template.result(binding)

      file_name = "export-#{table_name}-#{Time.now.to_i}.csv"
      arguments = []
      arguments << %Q(-c "\\copy (SELECT * FROM #{table_name}) to 'public/#{file_name}' with csv")
      arguments << %Q(-w -h #{@settings['database']['host']} -p #{@settings['database']['port']} -U #{@settings['database']['username']} -d #{@settings['database']['tabular']['database']})
      arguments << %Q(> log/psql.log 2>&1)

      `psql #{arguments.join(" ")}`

      puts arguments.join(" ")

      return file_name
    end

    def response(request)
      file = to_csv(request.params['table'])
      [200, {'Content-Type' => 'text/csv', 'Content-Disposition' => 'attachment'}, FileStreamer.new("public/#{file}")]
    end

    def call(env)
      response(Rack::Request.new(env))
    end
  end
end
