#!/usr/bin/env ruby
require 'active_record'
require 'faraday'
require 'yaml'
require 'pry-byebug'

@settings = YAML.load_file(File.join(__dir__, '..', 'config', 'settings.yml'))

ActiveRecord::Base.establish_connection(
  adapter:  'postgresql',
  host: @settings['database']['host'],
  port: @settings['database']['port'],
  database: @settings['database']['geospatial']['database'],
  username: @settings['database']['username'],
  password: @settings['database']['password'],
  schema_search_path: @settings['database']['geospatial']['schema']['data']
)

def columns_in_table(name, schema=@settings['database']['geospatial']['schema']['data'])
  sql = <<~SQL
    SELECT
      column_name
    FROM
      information_schema.columns
    WHERE
      table_schema = '#{schema}'
    AND
      table_name   = '#{name}';
  SQL
  ActiveRecord::Base.connection.execute(sql).pluck('column_name')
end

def sql_query(table)
  return "SELECT * FROM #{@settings['database']['geospatial']['schema']['data']}.#{table};" unless columns_in_table(table).include?('shape')
  columns = columns_in_table(table).reject { |column_name| column_name == 'shape' }
  "SELECT " +
  columns.join(', ') +
  ', sde.ST_AsText(sde.ST_Transform(shape, 4326)) AS the_geom' +
  " FROM #{@settings['database']['geospatial']['schema']['data']}.#{table};"
end

def record_item_queue(table, id)
  open(File.join(__dir__, 'import_list.csv'), 'a') do |f|
    f.puts "#{table},#{id}"
  end
end

def add_carto_sync_for(table, schema=@settings['database']['geospatial']['schema']['data'])
  response = Faraday.post do |req|
    req.url "#{@settings['carto']['url']}/api/v1/synchronizations/"
    req.params['api_key'] = @settings['carto']['api_key']
    req.body =  {
                  "connector": {
                    "provider": "postgres",
                    "connection": {
                      "server": @settings['database']['host'],
                      "database": @settings['database']['geospatial']['database'],
                      "port": @settings['database']['port'],
                      "username": @settings['database']['username'],
                      "password": @settings['database']['password']
                    },
                    "table": table,
                    "sql_query": sql_query(table),
                    "schema": schema
                  },
                  "interval": 2592000
                }.to_json
    req.headers["content-type"] = 'application/json'
  end
  parsed_body = JSON.parse(response.body)
  record_item_queue(table, parsed_body['data_import']['item_queue_id'])
end

# Need to make sure all tables we want have permission for viewer user.
def tables_with_permission(schema=@settings['database']['geospatial']['schema']['data'])
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
    req.url "#{@settings['carto']['url']}/api/v1/synchronizations"
    req.params['api_key'] = @settings['carto']['api_key']
    req.headers["content-type"] = 'application/json'
  end
  JSON.parse(response.body)['synchronizations'].pluck('name').compact
end

tables_to_sync = ActiveRecord::Base.connection.tables - carto_tables
no_permission_to_sync = ActiveRecord::Base.connection.tables - tables_with_permission
tables_with_permission_to_sync = tables_to_sync - no_permission_to_sync
tables_with_permission_to_sync.reject! { |table_name| table_name =~ /(parcel)|(i\d+)|(sde)/i }
puts 'Number to sync:' + tables_with_permission_to_sync.count.to_s

count = tables_with_permission_to_sync.count

while count > 0
  tables_with_permission_to_sync.first(5).each {|table| add_carto_sync_for(table) }
  tables_with_permission_to_sync -= tables_with_permission_to_sync.first(5)
  count -= 5
  sleep 45
end
