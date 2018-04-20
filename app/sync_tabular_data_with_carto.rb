#!/usr/bin/env ruby
require 'active_record'
require 'faraday'
require 'pry-byebug'
require 'yaml'

@settings = YAML.load_file(File.join(__dir__, '..', 'config', 'settings.yml'))

ActiveRecord::Base.establish_connection(
  adapter:  'postgresql',
  host: @settings['database']['host'],
  port: @settings['database']['port'],
  database: @settings['database']['tabular']['database'],
  username: @settings['database']['username'],
  password: @settings['database']['password'],
  schema_search_path: @settings['database']['tabular']['schema']['data']
)

def record_item_queue(table, id)
  open(File.join(__dir__, '..', 'log', 'import_list.csv'), 'a') do |f|
    f.puts "#{table},#{id}"
  end
end

def add_carto_sync_for(table, schema=@settings['database']['tabular']['schema']['data'])
  response = Faraday.post do |req|
    req.url "#{@settings['carto']['url']}/api/v1/synchronizations/"
    req.params['api_key'] = @settings['carto']['api_key']
    req.body =  {
                  "connector": {
                    "provider": "postgres",
                    "connection": {
                      "server": @settings['database']['host'],
                      "database": @settings['database']['tabular']['database'],
                      "port": @settings['database']['port'],
                      "username": @settings['database']['username'],
                      "password": @settings['database']['password']
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

def tables_with_permission(schema=@settings['database']['tabular']['schema']['data'])
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
tables_to_skip = ["b17026_income_to_poverty_by_families_acs_ct",
                  "b18101_disability_by_gender_age_acs_ct",
                  "b19001_hh_income_acs_ct",
                  "b08134_means_by_traveltime_to_work_acs_bg",
                  "b18135_health_insurance_by_disability_status_acs_ct",
                  "b19037_hh_income_by_age_race_acs_ct",
                  "b07403_geomobility_out_migration_acs_m",
                  "b08303_traveltime_to_work_by_residence_acs_m",
                  "b08006_means_transportation_to_work_by_residence_gender_acs_ct",
                  "b25046_b25044_b01003_hh_vehicle_ownership_acs_m",
                  "b25002_b25003_hu_occupancy_by_tenure_race_acs_bg",
                  "b23025_employment_acs_ct",
                  "b11007_hh_with_seniors_acs_ct",
                  "b22002_hh_foodstamps_snap_hhtype_kids_acs_m",
                  "demo_race_latino_detail_ct",
                  "b17001_poverty_by_age_gender_acs_m",
                  "_data_browser"]
tables_with_permission_to_sync = tables_to_sync - no_permission_to_sync - tables_to_skip
count = tables_with_permission_to_sync.count

while count > 0
  tables_with_permission_to_sync.first(5).each {|table| add_carto_sync_for(table) }
  tables_with_permission_to_sync -= tables_with_permission_to_sync.first(5)
  count -= 5
  sleep 45
end
