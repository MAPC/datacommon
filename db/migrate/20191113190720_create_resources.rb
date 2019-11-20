class CreateResources < ActiveRecord::Migration[6.0]
  def change
    create_table :resources do |t|
      t.string :title
      t.string :url
      t.string :media_type
      t.text :description
      t.string :year_published
      t.string :month_published

      t.timestamps
    end
  end
end
