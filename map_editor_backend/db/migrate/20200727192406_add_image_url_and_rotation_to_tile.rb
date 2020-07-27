class AddImageUrlAndRotationToTile < ActiveRecord::Migration[6.0]
  def change
    add_column :tiles, :image_url, :string
    add_column :tiles, :rotation, :integer
  end
end
