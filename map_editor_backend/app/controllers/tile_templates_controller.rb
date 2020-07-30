class TileTemplatesController < ApplicationController
  def index
    render json: TileTemplate.all
  end

  def create
    tile_template = TileTemplate.new(tile_template_params)

    if tile_template.save
      render json: tile_template
    else
      render json: tile_template.errors
    end
  end

private

  def tile_template_params
    params.require("tile_template").permit(:name, :tile_image)
  end
end
