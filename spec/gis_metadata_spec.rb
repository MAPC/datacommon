require "rack/test"
require 'pry-byebug'

RSpec.describe "serve gis metadata" do
  include Rack::Test::Methods

  def app
    Rack::Builder.new do
      map '/' do
        run Proc.new {|env| [200, {'Content-Type' => 'text/html'}, "foo"] }
      end
    end.to_app
  end

  it "serves a web page" do
    response = get "/:8080"
    expect(last_response).to be_ok
  end
end
