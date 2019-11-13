json.array! @resources do |resource|
  json.title resource.title
  json.media_type resource.media_type
  json.description resource.description
  json.year_published resource.year_published
  json.month_published resource.month_published
  json.(resource, :created_at, :updated_at)
  json.url url_for(resource.attachment)
  json.attachment resource.attachment
  json.image_thumbnail resource.attachment.preview(resize: "300x300")
  json.image_thumbnail_url url_for(resource.attachment.preview(resize: "300x300"))
end
