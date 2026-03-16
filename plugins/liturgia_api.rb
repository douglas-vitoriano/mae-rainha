require "net/http"
require "json"
require "uri"

module LiturgiaAPI
  API_URL = "https://liturgia.up.railway.app/v2/"

  def self.buscar_periodo(dias: 7)
    uri = URI("#{API_URL}?periodo=#{dias}")
    response = Net::HTTP.get_response(uri)

    if response.is_a?(Net::HTTPSuccess)
      json = JSON.parse(response.body)
      return json.is_a?(Array) ? json : [json]
    else
      Bridgetown.logger.error "Liturgia API", "Erro HTTP: #{response.code}"
      return []
    end
  rescue StandardError => e
    Bridgetown.logger.error "Liturgia API", "Exceção: #{e.message}"
    return []
  end
end

Bridgetown::Hooks.register :site, :pre_render do |site|
  liturgias = LiturgiaAPI.buscar_periodo(dias: 7)

  site.data["liturgia_hoje"]    = liturgias.first
  site.data["liturgia_periodo"] = liturgias.each_with_object({}) do |l, h|
    h[l["data"]] = l
  end
end
