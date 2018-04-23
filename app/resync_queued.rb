#!/usr/bin/env ruby
require 'active_record'
require 'faraday'
require 'pry-byebug'
require 'yaml'

@settings = YAML.load_file(File.join(__dir__, '..', 'config', 'settings.yml'))

def resync_queued(import_id)
  Faraday.put do |req|
    req.url "#{@settings['carto']['url']}/api/v1/synchronizations/#{import_id}/sync_now"
    req.params['api_key'] = @settings['carto']['api_key']
    req.headers["content-type"] = 'application/json'
  end
end

def delete_queued(import_id)
  response = Faraday.delete do |req|
    req.url "#{@settings['carto']['url']}/api/v1/synchronizations/#{import_id}"
    req.params['api_key'] = @settings['carto']['api_key']
    req.headers["content-type"] = 'application/json'
  end
end

def carto_synchronizations
  response = Faraday.get do |req|
    req.url "#{@settings['carto']['url']}/api/v1/synchronizations"
    req.params['api_key'] = @settings['carto']['api_key']
    req.headers["content-type"] = 'application/json'
  end
  JSON.parse(response.body)['synchronizations']
end

carto_synchronizations.each do |synchronization|
  delete_queued(synchronization['id']) if synchronization['state'] == 'failure'
  delete_queued(synchronization['id']) if synchronization['state'] == 'queued'
end
