#!/usr/bin/env ruby
require 'active_record'
require 'yaml'
require 'pry-byebug'
require 'nokogiri'

@settings = YAML.load_file('settings.yml')

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

definition = Nokogiri::XML(all_metadata[10]['definition'])
documentation = Nokogiri::XML(all_metadata[10]['documentation'])

# Food Retailers (2016)
# Overview
# Food Retailers locations across Massachusetts in 2016
# Source: Reference USA, MassGIS and Tufts University
# Date: 2016 (retailers), April 2016 (MassGIS – Farmers Markets)
# Description of Dataset: This is a Massachusetts food retailer and farmers market dataset. Food retailer data was compiled, cleaned, and categorized for food retailers with one of the eight relevant primary NAICS codes: 445110, 445120, 445210, 445220, 445230, 452910, 446,110, 445110. This data was downloaded from ReferenceUSA. This dataset also includes farmers markets, downloaded from MassGIS.
# Description of Source: This Dataset is part of the Food Access Index completed in partnership with the 2016 Tufts University Field Project and MAPC. See the Food Access Index report for more details.
# Updating data: This dataset will be updated when data is validated on a more granular level when working with Mass in Motion communities or municipal partners

DESIRED_FIELDS = %w[]

documentation.xpath('//attr').each do |attribute|
  puts "{\n"
  attribute.children.each do |property|
    puts "\"#{property.name}\":\"#{property.inner_html}\"," unless property.name == 'attrdomv'
  end
  puts "}\n"
end

# binding.pry

puts 'done'
