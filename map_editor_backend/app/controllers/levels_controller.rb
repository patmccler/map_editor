class LevelsController < ApplicationController
  def show
    level = Level.find(params[:id])
    render json: level.to_json( except: %i[created_at updated_at])
  end

  def index
    render json: Level.all, except: %i[created_at updated_at]
  end
end
