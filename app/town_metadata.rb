#!/usr/bin/env ruby
require 'active_record'
require 'active_support/core_ext/hash'
require 'yaml'
require 'nokogiri'
require 'rack'
require 'erb'

module TownMetadata
  class API
    def connect_to_town_database
      template = ERB.new File.new("config/settings.yml").read
      @settings = YAML.load template.result(binding)

      ActiveRecord::Base.establish_connection(
        adapter:  'postgresql',
        host: @settings['database']['host'],
        port: @settings['database']['port'],
        database: @settings['database']['town']['database'],
        username: @settings['database']['username'],
        password: @settings['database']['password'],
        schema_search_path: @settings['database']['town']['schema']['metadata']
      )
    end

    def metadata_for(tables, columns)
      if tables
        conditions = tables.map{|table| "LOWER(name) LIKE LOWER('#{table}')"}.join(' OR ')
        where_clause = "WHERE #{conditions}"
      else
        where_clause = ''
      end

      sql = <<~SQL
      SELECT
        #{columns}
      FROM
        gdb_items
      #{where_clause};
      SQL
      ActiveRecord::Base.connection.execute(sql)
    end

    def response(request)
      connect_to_town_database
      prefix = 'towndata.mapc.'
      metadata = {}

      if request.params['tables']
        tables = request.params['tables'].split(',')
        tables.map!{|x| "#{prefix}#{x}"}
      else
        tables = nil
      end

      if request.params['columns']
        columns = request.params['columns'].split(',')

        unless columns.include?('name')
          columns << 'name'
        end

        columns = columns.join(',')
      else
        columns = 'name,definition,documentation'
      end

      metadata_for(tables, columns).each do |table|
        table_name = table['name'].sub(prefix, '').downcase

        metadata[table_name] = {}
        metadata[table_name]['documentation'] = Hash.from_xml(table['documentation']) unless table['documentation'].blank?
        metadata[table_name]['definition'] = Hash.from_xml(table['definition']) unless table['definition'].blank?
      end

      [200, {'Content-Type' => 'application/json'}, [metadata.to_json]]
    end

    def call(env)
      response(Rack::Request.new(env))
    end
  end
end
