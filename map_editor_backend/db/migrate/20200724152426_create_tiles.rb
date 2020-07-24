class CreateTiles < ActiveRecord::Migration[6.0]
  def change
    create_table :tiles do |t|
      t.integer :x
      t.integer :y
      t.references :level, null: false, foreign_key: true

      t.timestamps
    end
  end
end
