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

  def destroy
    tile = Tile.find(params[:id])
    if tile.destroy
      render json: tile, only: %i[x y id]
    else
      render json: { error: "Couldn't delete tile with id #{params[:id]}" }
    end
  end

private

  def tile_params
    params.require(:tile).permit(:x, :y, :image_url)
  end
end
