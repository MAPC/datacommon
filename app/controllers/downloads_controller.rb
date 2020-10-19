class DownloadsController < ApplicationController
  def shapefile
    send_file(Shapefile.new(file_params).execute, type: 'application/zip')
  end

  def csv
    send_file(Csv.new(file_params).execute, type: 'text/csv')
  end

  private

  def file_params
    params.permit(:table, :database, :years, :year_col)
  end
end
