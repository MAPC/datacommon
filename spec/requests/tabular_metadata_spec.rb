require 'rails_helper'

RSpec.describe 'serve tabular metadata', type: :request do
  it 'serves a web page with JSON' do
    get '/ds?tables=energy_masssave_elec_gas_ci_consumption_m'

    parsed = JSON.parse(response.body)

    expect(parsed.keys).to include('energy_masssave_elec_gas_ci_consumption_m')
  end
end
