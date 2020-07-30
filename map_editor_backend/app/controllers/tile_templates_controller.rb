class TileTemplatesController < ApplicationController
  def index
    render json: TileTemplate.all.to_json(except: %i[created_at updated_at])
  end

  def create
    tile_template = TileTemplate.new(tile_template_params)
    if tile_template.save && params[:tile_template][:tile_image].present?
      render json: tile_template.to_json(except: %i[created_at updated_at])
    else
      render json: tile_template.errors.to_json,
             status: 403
    end
  end

private

  def tile_template_params
    params.require("tile_template").permit(:name, :tile_image)
  end
end
