Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources :levels, only: %i[index create] do
    resources :tiles, only: %i[create update destroy]
  end
end
