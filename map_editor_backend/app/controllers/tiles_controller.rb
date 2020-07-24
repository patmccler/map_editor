class TilesController < ApplicationController
  def create
    level = Level.find(params[:level_id])
    tile = level.tiles.build(tile_params)

    if tile.save
      render json: tile, only: %i[x y id]
    else
      render json: { msg: "Error saving tile for #{level.name} at #{tile.x}, #{tile.y}", errors: tile.errors }
    end
  end

private

  def tile_params
    params.require(:tile).permit(:x, :y)
  end
end
