class LevelsController < ApplicationController
  def show
    level = Level.find(params[:id])
    render json: level.to_json(include: :tiles, except: %i[created_at updated_at])
  end

  def index
    render json: Level.all, include: { tiles: { only: %i[x y id] } }, except: %i[created_at updated_at]
  end
end
