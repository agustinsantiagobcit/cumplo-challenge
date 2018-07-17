class DollarController < ApplicationController

  def get
    response.headers['Access-Control-Allow-Origin'] = request.headers['Origin'] || '*'   
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Headers'] = 'accept, content-type'

    response = HTTParty.get('https://api.sbif.cl/api-sbifv3/recursos_api/dolar/periodo/' + params[:year] + '/' + params[:month] + '/dias_i/' + params[:day] + '/' + params[:year2] + '/' + params[:month2] + '/dias_f/' + params[:day2] + '?apikey=00e1fb47db8fcd1a3aecfadf84d797ed22638782&formato=json')
    data = response.parsed_response["Dolares"]

    render json: data
  end

end
