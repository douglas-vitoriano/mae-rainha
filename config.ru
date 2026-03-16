# This file is used by Rack-based servers during the Bridgetown boot process.

ENV['LC_ALL'] = 'pt_BR.UTF-8'
ENV['LANG'] = 'pt_BR.UTF-8'

require "bridgetown-core/rack/boot"

Bridgetown::Rack.boot

run RodaApp.freeze.app # see server/roda_app.rb
