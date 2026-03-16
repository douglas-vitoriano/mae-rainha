---
layout: liturgia
title: Liturgia Diária
description: Leituras, salmo, evangelho e orações da Santa Missa de hoje. Acompanhe a liturgia católica diária do Grupo de Oração Mãe Rainha.
---

<section class="liturgia-hero" aria-labelledby="liturgia-titulo">
  <div class="liturgia-hero-inner">
    <div class="liturgia-data-nav">
      <button class="liturgia-nav-btn" id="btn-anterior" aria-label="Dia anterior">
        <i class="fas fa-chevron-left" aria-hidden="true"></i>
      </button>
      <div class="liturgia-data-badge" id="liturgia-data-badge" aria-live="polite">
        <i class="fas fa-cross" aria-hidden="true"></i>
        <span id="liturgia-data-hoje">Carregando data…</span>
      </div>
      <button class="liturgia-nav-btn" id="btn-proximo" aria-label="Próximo dia">
        <i class="fas fa-chevron-right" aria-hidden="true"></i>
      </button>
    </div>
    <h1 class="liturgia-titulo" id="liturgia-titulo">
      Liturgia <em>do Dia</em>
    </h1>
    <p class="liturgia-subtitulo">
      Que a Palavra de Deus ilumine seu caminho hoje e sempre.
    </p>
    <div class="liturgia-cor-badge" id="liturgia-cor-badge" aria-live="polite" hidden>
      <span id="liturgia-cor-icone" aria-hidden="true"></span>
      <span id="liturgia-cor-texto"></span>
    </div>
  </div>
</section>

<div class="liturgia-container">
  <%# ── Oração de abertura ── %>
  <div class="liturgia-abertura" role="complementary" aria-label="Oração de abertura">
    <span class="liturgia-abertura-icone" aria-hidden="true">🙏</span>
    <blockquote class="liturgia-abertura-texto">
      "Senhor, abre meus lábios, e minha boca proclamará o teu louvor."
    </blockquote>
    <cite class="liturgia-abertura-ref">— Salmo 50, 17</cite>
  </div>
  <%# ── Tempo litúrgico ── %>
  <div class="liturgia-tempo" id="liturgia-tempo" aria-live="polite" hidden>
    <i class="fas fa-church" aria-hidden="true"></i>
    <span id="liturgia-tempo-texto"></span>
  </div>
  <%# ── Loading / conteúdo principal ── %>
  <div id="liturgia-content" role="main" aria-label="Leituras do dia" aria-live="polite">
    <div class="liturgia-loading">
      <div class="spinner" role="status" aria-label="Carregando"></div>
      <p>Buscando a liturgia do dia…</p>
    </div>
  </div>
  <%# ── Mistérios do Rosário ── %>
  <section class="liturgia-misterios" aria-labelledby="misterios-titulo">
    <div class="liturgia-bloco-dark">
      <p class="liturgia-bloco-label" id="misterios-titulo">
        <span aria-hidden="true">🌹</span> Mistérios do Rosário de Hoje
      </p>
      <div id="misterios-hoje"></div>
    </div>
  </section>
  <%# ── Fontes externas ── %>
  <nav class="liturgia-fontes" aria-label="Fontes para aprofundamento">
    <p class="liturgia-bloco-label">
      <span aria-hidden="true">📚</span> Fontes para aprofundamento
    </p>
    <div class="liturgia-fontes-links">
      <a href="https://www.vaticannews.va/pt/palavra-do-dia.html" target="_blank" rel="noopener noreferrer" class="liturgia-fonte-link">
        <i class="fas fa-external-link-alt" aria-hidden="true"></i> Vatican News
      </a>
      <a href="https://www.cnbb.org.br/liturgia-diaria/" target="_blank" rel="noopener noreferrer" class="liturgia-fonte-link">
        <i class="fas fa-external-link-alt" aria-hidden="true"></i> CNBB
      </a>
      <a href="https://liturgia.cancaonova.com/pb/" target="_blank" rel="noopener noreferrer" class="liturgia-fonte-link">
        <i class="fas fa-external-link-alt" aria-hidden="true"></i> Canção Nova
      </a>
    </div>
  </nav>
</div>
