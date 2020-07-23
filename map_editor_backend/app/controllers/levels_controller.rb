class LevelsController < ApplicationController
  def show
    level = Level.find(params[:id])
    render json: level, exclude: %i[created_at updated_at]
  end
end