json.resource do
  json.title @resource.title
  json.media_type @resource.media_type
  json.description @resource.description
  json.year_published @resource.year_published
  json.month_published @resource.month_published
  json.(@resource, :created_at, :updated_at)
  json.url url_for(@resource.attachment)
  json.attachment @resource.attachment
  if @image_thumbnail.present?
    json.image_thumbnail @image_thumbnail
    json.image_thumbnail_url url_for(@image_thumbnail)
  end
end
