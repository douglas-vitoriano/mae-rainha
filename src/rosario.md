---
layout: rosario
title: Santo Rosário
description: Reze o Santo Rosário com os mistérios do dia. Meditações, orações e estrutura completa da devoção mariana católica — Grupo de Oração Mãe Rainha.
page_class: page-rosario
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Santo Rosário — Grupo de Oração Mãe Rainha",
  "headline": "Reze o Santo Rosário com os mistérios do dia",
  "description": "Reze o Santo Rosário com os mistérios do dia. Meditações, orações e estrutura completa da devoção mariana católica.",
  "url": "<%= site.config.url %>/rosario",
  "inLanguage": "pt-BR",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Grupo de Oração Mãe Rainha",
    "url": "<%= site.config.url %>",
    "description": "Adoração, oração e louvor — Comunidade Nossa Senhora Aparecida, Paróquia Santa Cruz, Barueri - SP"
  },
  "about": [
    {
      "@type": "Thing",
      "name": "Santo Rosário",
      "sameAs": "https://pt.wikipedia.org/wiki/Ros%C3%A1rio"
    },
    {
      "@type": "Thing",
      "name": "Oração católica"
    }
  ],
  "mainEntity": {
    "@type": "HowTo",
    "name": "Como rezar o Santo Rosário",
    "description": "Guia completo para rezar o Santo Rosário com os mistérios Gozosos, Dolorosos, Gloriosos e Luminosos.",
    "step": [
      { "@type": "HowToStep", "position": 1, "name": "Orações Iniciais", "text": "Comece com o Credo Apostólico, 1 Pai Nosso, 3 Ave Marias e 1 Glória." },
      { "@type": "HowToStep", "position": 2, "name": "Anunciar o Mistério", "text": "Anuncie o mistério do dia e medite sobre ele." },
      { "@type": "HowToStep", "position": 3, "name": "Rezar cada dezena", "text": "Para cada um dos 5 mistérios: 1 Pai Nosso, 10 Ave Marias, 1 Glória e a Oração de Fátima." },
      { "@type": "HowToStep", "position": 4, "name": "Orações Finais", "text": "Conclua com a Salve Rainha." }
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "Grupo de Oração Mãe Rainha",
    "url": "<%= site.config.url %>",
    "logo": {
      "@type": "ImageObject",
      "url": "<%= site.config.url %>/images/logotipo.png",
      "width": 512,
      "height": 512
    }
  },
  "image": {
    "@type": "ImageObject",
    "url": "<%= site.config.url %>/images/logotipo.png",
    "width": 512,
    "height": 512
  }
}
</script>

<section class="rosario-hero" aria-labelledby="rosario-titulo">
  <div class="rosario-hero-inner">
    <div class="rosario-data-badge">
      <i class="fas fa-circle" aria-hidden="true"></i>
      <span id="rosario-dia-semana">Carregando…</span>
    </div>
    <h1 class="rosario-titulo" id="rosario-titulo">
      Santo <em>Rosário</em>
    </h1>
    <p class="rosario-subtitulo">
      Rezai o Rosário todos os dias. — Nossa Senhora de Fátima
    </p>
    <div class="rosario-misterio-badge" id="rosario-misterio-badge">
      <span id="rosario-misterio-icone" aria-hidden="true"></span>
      <span id="rosario-misterio-nome"></span>
    </div>
  </div>
</section>

<div class="rosario-container">
  <div class="rosario-abertura" role="complementary">
    <span class="rosario-abertura-icone" aria-hidden="true">🌹</span>
    <blockquote class="rosario-abertura-texto">
      "O Rosário é a minha oração favorita… É uma oração maravilhosa!"
    </blockquote>
    <cite class="rosario-abertura-ref">— São João Paulo II</cite>
  </div>

  <div id="rosario-content" role="main" aria-label="Santo Rosário" aria-live="polite">
    <div class="rosario-loading">
      <div class="spinner" role="status" aria-label="Carregando"></div>
      <p>Preparando os mistérios do dia…</p>
    </div>
  </div>
</div>
