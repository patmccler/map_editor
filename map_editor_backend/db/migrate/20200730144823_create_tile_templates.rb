class CreateTileTemplates < ActiveRecord::Migration[6.0]
  def change
    create_table :tile_templates do |t|
      t.string :name

      t.timestamps
    end
  end
end
