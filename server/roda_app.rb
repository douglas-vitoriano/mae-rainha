# Roda is a simple Rack-based framework with a flexible architecture based
# on the concept of a routing tree. Bridgetown uses it for its development
# server, but you can also run it in production for fast, dynamic applications.
#
# Learn more at: https://www.bridgetownrb.com/docs/routes

require "rack"

class RodaApp < Roda
  plugin :bridgetown_server

  use Rack::Static,
    urls: ["/images", "/sw.js", "/manifest.json", "/offline.html"],
    root: File.join(__dir__, "..", "output"),
    header_rules: [
      ["/images/icons", {
        "Cache-Control"  => "public, max-age=31536000, immutable",
        "X-Content-Type-Options" => "nosniff"
      }],
      ["/images", {
        "Cache-Control" => "public, max-age=604800",
        "X-Content-Type-Options" => "nosniff"
      }],
      ["/sw.js", {
        "Cache-Control"  => "no-cache, no-store, must-revalidate",
        "Content-Type"   => "application/javascript; charset=utf-8",
        "Service-Worker-Allowed" => "/"
      }],
      ["/manifest.json", {
        "Cache-Control" => "public, max-age=3600",
        "Content-Type"  => "application/manifest+json; charset=utf-8"
      }],
      ["/offline.html", {
        "Cache-Control" => "public, max-age=86400"
      }]
    ]

  route do |r|
    r.bridgetown
  end
end