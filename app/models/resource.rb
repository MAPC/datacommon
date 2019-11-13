class Resource < ApplicationRecord
  validates :attachment, presence: true
  has_one_attached :attachment
end
