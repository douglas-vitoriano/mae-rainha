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
  <div class="liturgia-abertura" role="complementary" aria-label="Oração de abertura">
    <span class="liturgia-abertura-icone" aria-hidden="true">🙏</span>
    <blockquote class="liturgia-abertura-texto">
      "Senhor, abre meus lábios, e minha boca proclamará o teu louvor."
    </blockquote>
    <cite class="liturgia-abertura-ref">— Salmo 50, 17</cite>
  </div>

  <div class="liturgia-tempo" id="liturgia-tempo" aria-live="polite" hidden>
    <i class="fas fa-church" aria-hidden="true"></i>
    <span id="liturgia-tempo-texto"></span>
  </div>

  <div id="liturgia-content" role="main" aria-label="Leituras do dia" aria-live="polite">
    <div class="liturgia-loading">
      <div class="spinner" role="status" aria-label="Carregando"></div>
      <p>Buscando a liturgia do dia…</p>
    </div>
  </div>
</div>
