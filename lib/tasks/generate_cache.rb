#!/usr/bin/env ruby
require 'active_record'
require 'active_support/core_ext/hash'
require 'yaml'
require 'erb'
require 'zip'
require 'fileutils'

CACHE_DIR = 'public/cache'

def zip(file_name)
  file_path = File.join(CACHE_DIR, file_name)

  Zip::File.open("#{file_path}.zip", Zip::File::CREATE) do |zipfile|
    zipfile.add("#{file_name}.prj", "public/26986.prj")
    zipfile.add("#{file_name}.shp", "#{file_path}.shp")
    zipfile.add("#{file_name}.shx", "#{file_path}.shx")
    zipfile.add("#{file_name}.dbf", "#{file_path}.dbf")
  end
  return "#{file_name}.zip"
end

def to_shp(table_name, database_name)
  template = ERB.new File.new("config/settings.yml").read
  @settings = YAML.load template.result(binding)

  file_name = "export-#{table_name}"
  arguments = []
  arguments << %Q(-f 'ESRI Shapefile' #{File.join(CACHE_DIR, file_name)}.shp)
  arguments << %Q(PG:'host=#{@settings['database']['host']} port=#{@settings['database']['port']} user=#{@settings['database']['username']} dbname=#{database_name} password=#{@settings['database']['password']}')
  arguments << %Q(-sql 'SELECT *,sde.ST_AsText(shape) FROM #{table_name}' -skipfailures)

  `ogr2ogr #{arguments.join(" ")}`

  return file_name
end

def to_csv(table_name, database_name)
  template = ERB.new File.new("config/settings.yml").read
  @settings = YAML.load template.result(binding)

  file_name = "#{table_name}.csv"
  arguments = []
  arguments << %Q(-c "\\copy (SELECT * FROM #{table_name}) to '#{File.join(CACHE_DIR, file_name)}' with csv header")
  arguments << %Q(-w -h #{@settings['database']['host']} -p #{@settings['database']['port']} -U #{@settings['database']['username']} -d #{database_name})
  arguments << %Q(> log/psql.log 2>&1)

  `psql #{arguments.join(" ")}`

  puts arguments.join(" ")

  return file_name
end

template = ERB.new File.new("config/settings.yml").read
@settings = YAML.load template.result(binding)

connection = ActiveRecord::Base.establish_connection(
  adapter:  'postgresql',
  host: @settings['database']['host'],
  port: @settings['database']['port'],
  database: @settings['database']['tabular']['database'],
  username: @settings['database']['username'],
  password: @settings['database']['password'],
  schema_search_path: @settings['database']['tabular']['schema']['data']
)

tables = ActiveRecord::Base.connection.execute("SELECT * FROM tabular._data_browser WHERE db_name = 'gisdata';")

tables.each do |dataset|
  FileUtils.mkdir_p(CACHE_DIR)

  puts "Caching #{dataset['table_name']}"
  zip(to_shp("#{dataset['schemaname']}.#{dataset['table_name']}",dataset['db_name']))
  # to_csv("#{dataset['schemaname']}.#{dataset['table_name']}",dataset['db_name'])
end
