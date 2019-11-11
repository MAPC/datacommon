require "rails_helper"

RSpec.describe "downloads a csv file", :type => :request do
  it "serves a csv file" do
    get "/csv?table=tabular.b15001_educational_attainment_by_age_acs_ct&database=ds&years=2012-16&year_col=acs_year"

    expect(response.headers["Content-Type"]).to eq('text/csv')
  end
end
