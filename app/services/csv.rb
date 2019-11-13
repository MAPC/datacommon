require 'fileutils'
require 'csv'

class Csv
  CACHE_DIR = 'public/cache'

  def initialize(params)
    @params = params
  end

  def allowed_database_name(database_name)
    ['ds', 'gisdata', 'towndata'].include?(database_name) ? database_name : nil
  end

  def generate_filename(table_name, years = nil)
    if years
      years = years.split(',').sort
      years = ':' + years.join('_')
    end

    "#{table_name}#{years}.csv"
  end

  def to_csv(table_name, database_name, years = nil, year_col = nil)
    template = ERB.new File.new("config/settings.yml").read
    @settings = YAML.load template.result(binding)

    file_name = generate_filename(table_name, years)
    arguments = []
    arguments << %Q(-c "\\copy \(SELECT * FROM #{table_name})

    if years
      year_options = years.split(',').map{|year| "'#{year}'"}.join(',')
      arguments << %Q(WHERE #{year_col} IN (#{year_options}) ORDER BY #{year_col} DESC)
    end

    arguments << %Q(\) to '#{File.join(CACHE_DIR, file_name)}' with csv header")
    arguments << %Q(-w -h #{@settings['database']['host']} -p #{@settings['database']['port']} -U #{@settings['database']['username']} -d #{allowed_database_name(database_name)})

    psql_out = `psql #{arguments.join(' ')} 2>&1`
    FileUtils.mkdir_p('log')
    File.open('log/psql.log', 'a') { |file| file.write(psql_out) }

    puts arguments.join(" ")

    return file_name
  end

  def execute
    filename = generate_filename(@params['table'], @params['years'])

    FileUtils.mkdir_p(CACHE_DIR)
    unless File.file?(File.join(CACHE_DIR, filename))
      to_csv(@params['table'], @params['database'], @params['years'], @params['year_col'])
    end

    File.join(CACHE_DIR, filename)
  end
end
