class TileTemplatesController < ApplicationController
  def index
    render json: TileTemplate.all
  end

  def create
    tile_template = TileTemplate.new(tile_template_params)
    binding.pry
  end

private

  def tile_template_params
    params.require("tile_template").permit(:name, :tile_image)
  end
end
