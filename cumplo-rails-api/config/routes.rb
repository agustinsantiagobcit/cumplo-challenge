Rails.application.routes.draw do
  get '/uf/:day/:month/:year/:day2/:month2/:year2', to: 'uf#get'
  get '/dollar/:day/:month/:year/:day2/:month2/:year2', to: 'dollar#get'
  get '/tmc/:day/:month/:year/:day2/:month2/:year2', to: 'tmc#get'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
