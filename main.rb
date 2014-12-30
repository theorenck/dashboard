require 'rubygems' if RUBY_VERSION < "1.9"
require 'sinatra'

class Main < Sinatra::Base

	set :public_folder, File.dirname(__FILE__) + '/public'

	get '/' do
    send_file 'public/index.html'
  end

  get '/admin/*' do
    send_file 'public/admin/index.html'
  end

end
