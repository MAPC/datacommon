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

    def metadata_for(tablename)
      sql = <<~SQL
      SELECT
        orderid,name,alias,details
      FROM
        #{tablename};
      SQL
      ActiveRecord::Base.connection.execute(sql)
    end

    def response
      connect_to_tabular_database
      metadata = []

      ActiveRecord::Base.connection.tables.each do |table|
        metadata << metadata_for(table).to_json
      end

      [200, {'Content-Type' => 'application/json'}, [metadata.to_json]]
    end

    def call(env)
       response
    end
  end
end
