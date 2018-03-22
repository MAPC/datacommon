#!/usr/bin/env ruby
require 'active_record'
require 'active_support/core_ext/hash'
require 'yaml'
require 'pry-byebug'
require 'nokogiri'
require 'rack'

@settings = YAML.load_file('../config/settings.yml')

ActiveRecord::Base.establish_connection(
  adapter:  'postgresql',
  host: @settings['host'],
  port: @settings['port'],
  database: @settings['gis_database'],
  username: @settings['database_username'],
  password: @settings['database_password'],
  schema_search_path: 'sde'
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

definition = Nokogiri::XML(all_metadata[11]['definition'])
documentation = Nokogiri::XML(all_metadata[11]['documentation'])

metadata = []

all_metadata.each do |table|
  metadata << Hash.from_xml(table['documentation']) unless table['documentation'].blank?
end

app = Proc.new do |env|
    ['200', {'Content-Type' => 'application/json'}, [metadata.to_json]]
end

Rack::Handler::WEBrick.run app
