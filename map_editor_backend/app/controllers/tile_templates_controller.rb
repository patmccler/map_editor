class TileTemplatesController < ApplicationController
  def index
    image_urls = TileTemplate.all.each_with_object({}) do |tile_template, obj|
      obj[tile_template.id] = url_for(tile_template.tile_image)
    end

    tile_templates = TileTemplate.all.as_json(include: :tile_image, except: %i[created_at updated_at])
    tile_templates.each do |tile_template|
      tile_template["tile_image_url"] = image_urls[tile_template["id"]]
    end

    render json: tile_templates.to_json
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
