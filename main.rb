require 'rubygems' if RUBY_VERSION < "1.9"
require 'sinatra'


class Main < Sinatra::Base

  set :public_folder, File.dirname(__FILE__) + '/public'
  set :static_cache_control, [:public, :must_revalidate, :max_age => 3600]

  get '/ping' do
    status 200
    headers['Content-Type'] = 'application/json'
    body '{ alive : true }'
  end

  get '/*' do
    send_file 'public/index.html'
  end


end
