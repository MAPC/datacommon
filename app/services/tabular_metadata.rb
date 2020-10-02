class TabularMetadata
  def initialize(params)
    @params = params
  end

  def metadata_for(tablename, columns, subset)
    limit_clause = if subset == 'meta'
                     'LIMIT 15'
                   else
                     ''
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

      tables = if @params['tables']
                 @params['tables'].split(',')
               else
                 ActiveRecord::Base.connection.tables
               end

      columns = @params['columns'] || 'name,alias,details'

      tables.each do |table|
        metadata[table] = metadata_for(table, columns, @params['subset'])
      end

      metadata.to_json
    end
  end
end
