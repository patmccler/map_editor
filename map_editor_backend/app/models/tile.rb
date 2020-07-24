class Tile < ApplicationRecord
  belongs_to :level
  validates :x, :y, presence: true, numericality: { only_integer: true, greater_than: 0 }
end
