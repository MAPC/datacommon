#!/usr/bin/env ruby
require 'active_record'
require 'active_support/core_ext/hash'
require 'yaml'
require 'nokogiri'
require 'rack'
require 'erb'
require 'fileutils'

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
    @@cache_dir = 'public/cache'

    def allowed_database_name(database_name)
      ['ds', 'gisdata', 'towndata'].include?(database_name) ? database_name : nil
    end

    def generate_filename(table_name, years = nil)
      if years
        years = years.split(',').sort
        years = ':' + years.join('_')
      end

      "#{table_name}#{years}.csv"
    end

    def to_csv(table_name, database_name, years = nil, year_col = nil)
      template = ERB.new File.new("config/settings.yml").read
      @settings = YAML.load template.result(binding)

      file_name = generate_filename(table_name, years)
      arguments = []
      arguments << %Q(-c "\\copy \(SELECT * FROM #{table_name})

      if years
        year_options = years.split(',').map{|year| "'#{year}'"}.join(',')
        arguments << %Q(WHERE #{year_col} IN (#{year_options}) ORDER BY #{year_col} DESC)
      end

      arguments << %Q(\) to '#{File.join(@@cache_dir, file_name)}' with csv header")
      arguments << %Q(-w -h #{@settings['database']['host']} -p #{@settings['database']['port']} -U #{@settings['database']['username']} -d #{allowed_database_name(database_name)})

      psql_out = `psql #{arguments.join(' ')} 2>&1`
      FileUtils.mkdir_p('log')
      File.open('log/psql.log', 'a') { |file| file.write(psql_out) }

      puts arguments.join(" ")

      return file_name
    end

    def response(request)
      filename = generate_filename(request.params['table'], request.params['years'])

      FileUtils.mkdir_p(@@cache_dir)
      unless File.file?(File.join(@@cache_dir, filename))
        to_csv(request.params['table'], request.params['database'], request.params['years'], request.params['year_col'])
      end

      [200, {'Content-Type' => 'text/csv', 'Content-Disposition' => "attachment;filename=\"#{filename}\""}, FileStreamer.new(File.join(@@cache_dir, filename))]
    end

    def call(env)
      response(Rack::Request.new(env))
    end
  end
end
