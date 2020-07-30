class LevelsController < ApplicationController
  def create
    level = Level.new(level_params)
    if level.save
      render json: level.to_json(include: :tiles, except: %i[created_at updated_at])
    else

      render json: level.errors.to_json(include: :tiles, except: %i[created_at updated_at]),
             status: 403
    end
  end

  def index
    render json: Level.all, include: { tiles: { except: %i[created_at updated_at] } }, except: %i[created_at updated_at]
  end

private

  def level_params
    params.require("level").permit(:name, :width, :height)
  end
end
