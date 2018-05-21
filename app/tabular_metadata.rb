#!/usr/bin/env ruby
require 'active_record'
require 'active_support/core_ext/hash'
require 'yaml'
require 'nokogiri'
require 'rack'
require 'erb'
require 'pry-byebug'

module TabularMetadata
  class API
    def connect_to_tabular_database
      template = ERB.new File.new("config/settings.yml").read
      @settings = YAML.load template.result(binding)

      ActiveRecord::Base.establish_connection(
        adapter:  'postgresql',
        host: @settings['database']['host'],
        port: @settings['database']['port'],
        database: @settings['database']['tabular']['database'],
        username: @settings['database']['username'],
        password: @settings['database']['password'],
        schema_search_path: @settings['database']['tabular']['schema']['metadata']
      )
    end

    def metadata_for(tablename, columns, subset)
      if subset == 'meta'
        limit_clause = 'LIMIT 15'
      else
        limit_clause = ''
      end

      sql = <<~SQL
      SELECT
        #{columns}
      FROM
        #{tablename}
        #{limit_clause}
        ;
      SQL
      ActiveRecord::Base.connection.execute(sql)
    end

    def response(request)
      connect_to_tabular_database
      metadata = {}

      if request.params['tables']
        tables = request.params['tables'].split(',')
      else
        tables = ActiveRecord::Base.connection.tables
      end

      if request.params['columns']
        columns = request.params['columns']
      else
        columns = 'name,alias,details'
      end

      tables.each do |table|
        metadata[table] = metadata_for(table, columns, request.params['subset'])
      end

      [200, {'Content-Type' => 'application/json'}, [metadata.to_json]]
    end

    def call(env)
      response(Rack::Request.new(env))
    end
  end
end
