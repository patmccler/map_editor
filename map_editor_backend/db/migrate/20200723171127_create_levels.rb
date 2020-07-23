class CreateLevels < ActiveRecord::Migration[6.0]
  def change
    create_table :levels do |t|
      t.string :name
      t.integer :width
      t.integer :height

      t.timestamps
    end
  end
end
