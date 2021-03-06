class TownMetadata
  def initialize(params)
    @params = params
  end

  def metadata_for(tables, columns)
    if tables
      conditions = tables.map { |table| "LOWER(name) LIKE LOWER('#{table}')"}.join(' OR ')
      where_clause = "WHERE #{conditions}"
    else
      where_clause = ''
    end

    sql = <<~SQL
      SELECT
        #{columns}
      FROM
        gdb_items
      #{where_clause};
    SQL
    ActiveRecord::Base.connection.execute(sql)
  end

  def execute
    ActiveRecord::Base.connected_to(database: :town_metadata) do
      prefix = 'towndata.mapc.'
      metadata = {}

      if @params['tables']
        tables = @params['tables'].split(',')
        tables.map! { |x| "#{prefix}#{x}"}
      else
        tables = nil
      end

      if @params['columns']
        columns = @params['columns'].split(',')

        columns << 'name' unless columns.include?('name')

        columns = columns.join(',')
      else
        columns = 'name,definition,documentation'
      end

      metadata_for(tables, columns).each do |table|
        table_name = table['name'].sub(prefix, '').downcase

        metadata[table_name] = {}
        metadata[table_name]['documentation'] = Hash.from_xml(table['documentation']) if table['documentation'].present?
        metadata[table_name]['definition'] = Hash.from_xml(table['definition']) if table['definition'].present?
      end

      metadata.to_json
    end
  end
end
