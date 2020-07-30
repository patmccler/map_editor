class TileTemplatesController < ApplicationController
  def index
    render json: TileTemplate.all
  end

  def create
    tile_template = TileTemplate.new(tile_template_params)
    # binding.pry
    if tile_template.save && params[:post][:image].present?
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
