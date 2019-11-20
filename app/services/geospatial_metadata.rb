class GeospatialMetadata
  def initialize(params)
    @params = params
  end

  def metadata_for(tables, columns)
    if tables
      conditions = tables.map{|table| "name = '#{table}'"}.join(' OR ')
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
    ActiveRecord::Base.connected_to(database: :geospatial_metadata) do
      prefix = 'gisdata.mapc.'
      metadata = {}

      if @params['tables']
        tables = @params['tables'].split(',')
        tables.map!{|x| "#{prefix}#{x}"}
      else
        tables = nil
      end

      if @params['columns']
        columns = @params['columns'].split(',')

        unless columns.include?('name')
          columns << 'name'
        end

        columns = columns.join(',')
      else
        columns = 'name,definition,documentation'
      end

      metadata_for(tables, columns).each do |table|
        table_name = table['name'].sub(prefix, '')

        metadata[table_name] = {}
        metadata[table_name]['documentation'] = Hash.from_xml(table['documentation']) unless table['documentation'].blank?
        metadata[table_name]['definition'] = Hash.from_xml(table['definition']) unless table['definition'].blank?
      end

      metadata.to_json
    end
  end
end
