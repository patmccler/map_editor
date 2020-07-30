class TileTemplate < ApplicationRecord
  has_one_attached :tile_image
  validate :tile_image_present
  validates :name, presence: true

private

  def tile_image_present
    return unless tile_image.blank?

    errors.add("Image", "You must choose an image")
  end
end
