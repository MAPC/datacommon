class TabularMetadata
  def initialize(params)
    @params = params
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
    ActiveRecord::Base.connected_to(database: :tabular_metadata) do
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
end
