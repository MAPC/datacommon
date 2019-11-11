require 'zip'
require 'fileutils'

class Shapefile
  CACHE_DIR = 'public/cache'

  def initialize(params)
    @params = params
  end

  def allowed_database_name(database_name)
    ['ds', 'gisdata', 'towndata'].include?(database_name) ? database_name : nil
  end

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
    @settings = YAML.load(template.result(binding))
    file_name = "export-#{table_name}"
    arguments = []
    arguments << %Q(-f 'ESRI Shapefile' #{File.join(CACHE_DIR, file_name)}.shp)
    arguments << %Q(PG:'host=#{@settings['database']['host']} port=#{@settings['database']['port']} user=#{@settings['database']['username']} dbname=#{allowed_database_name(database_name)} password=#{@settings['database']['password']}')
    arguments << %Q(-sql 'SELECT *,sde.ST_AsText(shape) FROM #{table_name}' -skipfailures)

    `ogr2ogr #{arguments.join(" ")}`

    return file_name
  end

  def execute
    filename = "export-#{@params['table']}.zip"
    FileUtils.mkdir_p(CACHE_DIR)

    unless File.file?(File.join(CACHE_DIR, filename))
      zip(to_shp(@params['table'],@params['database']))
    end

    File.join(CACHE_DIR, filename)
  end
end
