class Level < ApplicationRecord
  has_many :tiles, dependent: :delete_all

  validates :name, presence: true
  validates :width, :height, numericality: { only_integer: true, greater_than: 0, less_than: 101 }
end
