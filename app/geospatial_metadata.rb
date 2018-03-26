#!/usr/bin/env ruby
require 'active_record'
require 'active_support/core_ext/hash'
require 'yaml'
require 'nokogiri'
require 'rack'

module GeospatialMetadata
  class API
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

    def all_metadata
      sql = <<~SQL
      SELECT
        name, definition, documentation
      FROM
        gdb_items;
      SQL
      ActiveRecord::Base.connection.execute(sql)
    end

    def response
        metadata = []

        all_metadata.each do |table|
          metadata << Hash.from_xml(table['documentation']) unless table['documentation'].blank?
        end

        [200, {'Content-Type' => 'application/json'}, [metadata.to_json]]
    end

    def call(env)
       response
     end
  end
end
