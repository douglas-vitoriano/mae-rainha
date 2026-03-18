---
layout: biblia
title: Bíblia Ave Maria
description: Consulte e leia a Bíblia completa — Antigo e Novo Testamento — na tradução Ave Maria. Grupo de Oração Mãe Rainha.
page_class: page-biblia
---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Bíblia Ave Maria — Grupo de Oração Mãe Rainha",
  "headline": "Leitura completa da Bíblia Sagrada",
  "description": "Consulte e leia a Bíblia completa — Antigo e Novo Testamento — na tradução Ave Maria.",
  "url": "<%= site.config.url %>/biblia",
  "inLanguage": "pt-BR",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Grupo de Oração Mãe Rainha",
    "url": "<%= site.config.url %>"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Grupo de Oração Mãe Rainha",
    "url": "<%= site.config.url %>",
    "logo": {
      "@type": "ImageObject",
      "url": "<%= site.config.url %>/images/logotipo.png"
    }
  }
}
</script>

<section class="biblia-hero" aria-labelledby="biblia-titulo">
  <div class="biblia-hero-inner">
    <div class="biblia-data-badge">
      <i class="fas fa-book-open" aria-hidden="true"></i>
      <span>Sagrada Escritura</span>
    </div>
    <h1 class="biblia-titulo" id="biblia-titulo">
      Bíblia <em>Ave Maria</em>
    </h1>
    <p class="biblia-subtitulo">
      "Tua palavra é lâmpada para meus pés e luz para o meu caminho." — Sl 119,105
    </p>
  </div>
</section>

<div class="biblia-container">
  <div class="biblia-layout">
    <aside class="biblia-sidebar" aria-label="Índice da Bíblia">
      <div class="biblia-sidebar-header">
        <h2 class="biblia-sidebar-titulo">Livros</h2>
      </div>
      <div class="biblia-testament-tabs" role="tablist" aria-label="Testamentos">
        <button class="biblia-testament-tab ativo" data-testament="at" role="tab"
          aria-selected="true" aria-controls="pan-livros">
          Antigo Testamento
        </button>
        <button class="biblia-testament-tab" data-testament="nt" role="tab"
          aria-selected="false" aria-controls="pan-livros">
          Novo Testamento
        </button>
      </div>
      <div class="biblia-sidebar-search">
        <div class="biblia-search-wrap">
          <i class="fas fa-search" aria-hidden="true"></i>
          <input type="search" id="biblia-busca" placeholder="Buscar livro…"
            autocomplete="off" aria-label="Buscar livro">
        </div>
      </div>
      <div class="biblia-livros-lista" id="biblia-livros-lista" role="listbox"
        aria-label="Lista de livros">
      </div>
    </aside>
    <main class="biblia-leitor" id="biblia-leitor" aria-live="polite" aria-label="Leitura bíblica">
      <div class="biblia-vazio">
        <span class="biblia-vazio-icone" aria-hidden="true">✦</span>
        <h3 class="biblia-vazio-titulo">Selecione um livro</h3>
        <p class="biblia-vazio-desc">Escolha um livro na barra lateral para iniciar a leitura.</p>
      </div>
    </main>
  </div>
</div>
