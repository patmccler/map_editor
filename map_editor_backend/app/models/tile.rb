class Tile < ApplicationRecord
  belongs_to :level
  validates :x, :y, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validate :unique_coord_in_level

private

  def unique_coord_in_level
    return unless level.tiles.any? { |tile| tile.x == x && tile.y == y }

    errors.add(:x, "must be a unique (x,y) coordinate in the level")
  end
end
