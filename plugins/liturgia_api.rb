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
      lista = json.is_a?(Array) ? json : [json]
      lista.reject { |l| l["erro"] }
    else
      Bridgetown.logger.error "Liturgia API", "Erro HTTP: #{response.code}"
      []
    end
  rescue StandardError => e
    Bridgetown.logger.error "Liturgia API", "Exceção: #{e.message}"
    []
  end
end

Bridgetown::Hooks.register :site, :pre_render do |site|
  liturgias = LiturgiaAPI.buscar_periodo(dias: 7)

  site.data["liturgia_hoje"]    = liturgias.first
  site.data["liturgia_periodo"] = liturgias.each_with_object({}) do |l, h|
    chave = begin
      Date.strptime(l["data"], "%d/%m/%Y").strftime("%d/%m/%Y")
    rescue
      l["data"]
    end
    h[chave] = l
  end

  Bridgetown.logger.info "Liturgia API", "#{liturgias.size} dia(s) carregado(s)"
end
