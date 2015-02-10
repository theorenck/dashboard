require './main'

map "/" do
  use Rack::Deflater
end

run Main.new