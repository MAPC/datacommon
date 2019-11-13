class TabularMetadata
  def initialize(params)
    @params = params
  end

  def connect_to_tabular_database
    template = ERB.new File.new("config/settings.yml").read
    @settings = YAML.load template.result(binding)

    ActiveRecord::Base.establish_connection(
      adapter:  'postgresql',
      host: @settings['database']['host'],
      port: @settings['database']['port'],
      database: @settings['database']['tabular']['database'],
      username: @settings['database']['username'],
      password: @settings['database']['password'],
      schema_search_path: @settings['database']['tabular']['schema']['metadata']
    )
  end

  def metadata_for(tablename, columns, subset)
    if subset == 'meta'
      limit_clause = 'LIMIT 15'
    else
      limit_clause = ''
    end

    sql = <<~SQL
    SELECT
      #{columns}
    FROM
      #{tablename}
      #{limit_clause}
      ;
    SQL
    ActiveRecord::Base.connection.execute(sql)
  end

  def execute
    connect_to_tabular_database
    metadata = {}

    if @params['tables']
      tables = @params['tables'].split(',')
    else
      tables = ActiveRecord::Base.connection.tables
    end

    if @params['columns']
      columns = @params['columns']
    else
      columns = 'name,alias,details'
    end

    tables.each do |table|
      metadata[table] = metadata_for(table, columns, @params['subset'])
    end

    metadata.to_json
  end
end
