#!/usr/bin/env ruby
require 'active_record'
require 'faraday'
require 'pry-byebug'
require 'yaml'

@settings = YAML.load_file('settings.yml')

ActiveRecord::Base.establish_connection(
  adapter:  'postgresql',
  host: @settings['host'],
  port: @settings['port'],
  database: @settings['tabular_database'],
  username: @settings['database_username'],
  password: @settings['database_password'],
  schema_search_path: @settings['tabular_schema']
)

def record_item_queue(table, id)
  open('import_list.csv', 'a') do |f|
    f.puts "#{table},#{id}"
  end
end

def add_carto_sync_for(table, schema=@settings['tabular_schema'])
  response = Faraday.post do |req|
    req.url "#{@settings['carto_url']}/api/v1/synchronizations/"
    req.params['api_key'] = @settings['carto_api_key']
    req.body =  {
                  "connector": {
                    "provider": "postgres",
                    "connection": {
                      "server": @settings['host'],
                      "database": @settings['tabular_database'],
                      "port": @settings['port'],
                      "username": @settings['database_username'],
                      "password": @settings['database_password']
                    },
                    "table": table,
                    "schema": schema
                  },
                  "interval": 2592000
                }.to_json
    req.headers["content-type"] = 'application/json'
  end
  parsed_body = JSON.parse(response.body)
  record_item_queue(table, parsed_body['data_import']['item_queue_id'])
end

def tables_with_permission(schema=@settings['tabular_schema'])
  sql = <<~SQL
  SELECT
      tablename
  FROM
      pg_tables
  WHERE
      has_table_privilege('viewer', schemaname||'.'||tablename, 'select')
  AND
      schemaname IN ('#{schema}');
  SQL
  ActiveRecord::Base.connection.execute(sql).pluck('tablename')
end

def carto_tables
  response = Faraday.get do |req|
    req.url "#{@settings['carto_url']}/api/v1/synchronizations"
    req.params['api_key'] = @settings['carto_api_key']
    req.headers["content-type"] = 'application/json'
  end
  JSON.parse(response.body)['synchronizations'].pluck('name')
end

tables_to_sync = ActiveRecord::Base.connection.tables - carto_tables
no_permission_to_sync = ActiveRecord::Base.connection.tables - tables_with_permission
tables_with_permission_to_sync = tables_to_sync - no_permission_to_sync
tables_with_permission_to_sync.first(1).each { |table| add_carto_sync_for(table) }
