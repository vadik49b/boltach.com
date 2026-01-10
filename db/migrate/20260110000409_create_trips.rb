class CreateTrips < ActiveRecord::Migration[8.1]
  def change
    create_table :trips do |t|
      t.string :name
      t.date :entry_date
      t.date :exit_date

      t.timestamps
    end
  end
end
