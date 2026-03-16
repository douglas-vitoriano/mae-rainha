/**
 * liturgia.js
 * Dados fornecidos pelo Ruby no build via window.LITURGIA_DATA
 * Toda estilização via classes CSS — zero style inline.
 */

import { initTabs } from './tabs.js'

const DIAS_SEMANA = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado',
]

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const MISTERIOS = {
  0: { nome: 'Gloriosos', lista: [
    'Ressurreição de Jesus',
    'Ascensão de Jesus ao Céu',
    'Descida do Espírito Santo — Pentecostes',
    'Assunção de Maria ao Céu',
    'Coroação de Maria Rainha do Universo',
  ]},
  1: { nome: 'Gozosos', lista: [
    'Anunciação do Anjo Gabriel a Maria',
    'Visitação de Maria à sua prima Isabel',
    'Nascimento de Jesus em Belém',
    'Apresentação de Jesus no Templo',
    'Encontro de Jesus no Templo aos 12 anos',
  ]},
  2: { nome: 'Dolorosos', lista: [
    'A Agonia de Jesus no Horto do Getsêmani',
    'A Flagelação de Jesus na Coluna',
    'A Coroação de Espinhos',
    'Jesus Carrega a Cruz até o Calvário',
    'A Crucificação e Morte de Jesus',
  ]},
  3: { nome: 'Luminosos', lista: [
    'O Batismo de Jesus no Rio Jordão',
    'As Bodas de Caná — o primeiro milagre',
    'O Anúncio do Reino de Deus e a Conversão',
    'A Transfiguração de Jesus no Monte Tabor',
    'A Instituição da Eucaristia na Última Ceia',
  ]},
  4: { nome: 'Dolorosos', lista: [
    'A Agonia de Jesus no Horto do Getsêmani',
    'A Flagelação de Jesus na Coluna',
    'A Coroação de Espinhos',
    'Jesus Carrega a Cruz até o Calvário',
    'A Crucificação e Morte de Jesus',
  ]},
  5: { nome: 'Gozosos', lista: [
    'Anunciação do Anjo Gabriel a Maria',
    'Visitação de Maria à sua prima Isabel',
    'Nascimento de Jesus em Belém',
    'Apresentação de Jesus no Templo',
    'Encontro de Jesus no Templo aos 12 anos',
  ]},
  6: { nome: 'Gloriosos', lista: [
    'Ressurreição de Jesus',
    'Ascensão de Jesus ao Céu',
    'Descida do Espírito Santo — Pentecostes',
    'Assunção de Maria ao Céu',
    'Coroação de Maria Rainha do Universo',
  ]},
}

const COR_CONFIG = {
  'Roxo':    { cls: 'cor-roxo',    icone: '🟣' },
  'Branco':  { cls: 'cor-branco',  icone: '⚪' },
  'Verde':   { cls: 'cor-verde',   icone: '🟢' },
  'Vermelho':{ cls: 'cor-vermelho',icone: '🔴' },
  'Rosa':    { cls: 'cor-rosa',    icone: '🌸' },
  'Dourado': { cls: 'cor-dourado', icone: '🟡' },
}

// ── Estado global da data navegada ──
let dataAtual = new Date()

function formatarDataLabel(date) {
  return `${DIAS_SEMANA[date.getDay()]}, ${date.getDate()} de ${MESES[date.getMonth()]} de ${date.getFullYear()}`
}

function atualizarBotaoProximo() {
  const btnProx = document.getElementById('btn-proximo')
  if (!btnProx) return
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const atual = new Date(dataAtual)
  atual.setHours(0, 0, 0, 0)
  btnProx.disabled = atual >= hoje
  btnProx.style.opacity = btnProx.disabled ? '0.35' : '1'
}

export function initLiturgiaPage() {
  const root = document.getElementById('liturgia-content')
  if (!root) return

  const badge = document.getElementById('liturgia-data-hoje')
  if (badge) badge.textContent = formatarDataLabel(dataAtual)

  renderMisterios(dataAtual.getDay())
  atualizarBotaoProximo()
  carregarLiturgia(root, dataAtual)

  document.getElementById('btn-anterior')?.addEventListener('click', () => {
    dataAtual = new Date(dataAtual)
    dataAtual.setDate(dataAtual.getDate() - 1)
    if (badge) badge.textContent = formatarDataLabel(dataAtual)
    renderMisterios(dataAtual.getDay())
    atualizarBotaoProximo()
    carregarLiturgia(root, dataAtual)
  })

  document.getElementById('btn-proximo')?.addEventListener('click', () => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const atual = new Date(dataAtual)
    atual.setHours(0, 0, 0, 0)
    if (atual >= hoje) return
    dataAtual = new Date(dataAtual)
    dataAtual.setDate(dataAtual.getDate() + 1)
    if (badge) badge.textContent = formatarDataLabel(dataAtual)
    renderMisterios(dataAtual.getDay())
    atualizarBotaoProximo()
    carregarLiturgia(root, dataAtual)
  })
}

function carregarLiturgia(root, date) {
  const corBadge = document.getElementById('liturgia-cor-badge')
  if (corBadge) {
    corBadge.className = 'liturgia-cor-badge'
    corBadge.hidden = true
  }
  const tempoEl = document.getElementById('liturgia-tempo')
  if (tempoEl) tempoEl.hidden = true

  const dia = String(date.getDate()).padStart(2, '0')
  const mes = String(date.getMonth() + 1).padStart(2, '0')
  const ano = date.getFullYear()
  const chave = `${dia}/${mes}/${ano}`

  const data = window.LITURGIA_DATA?.[chave]

  if (!data) {
    renderFallback(root)
    return
  }

  preencherMeta(data)
  renderLiturgia(root, data)
}

function preencherMeta(data) {
  const tempoEl  = document.getElementById('liturgia-tempo')
  const tempoTxt = document.getElementById('liturgia-tempo-texto')
  if (tempoEl && tempoTxt && data.liturgia) {
    tempoTxt.textContent = data.liturgia
    tempoEl.hidden = false
  }

  const corBadge = document.getElementById('liturgia-cor-badge')
  const corIcone = document.getElementById('liturgia-cor-icone')
  const corTxt   = document.getElementById('liturgia-cor-texto')
  if (corBadge && data.cor) {
    const cfg = COR_CONFIG[data.cor] || { cls: '', icone: '●' }
    corBadge.classList.add(cfg.cls)
    if (corIcone) corIcone.textContent = cfg.icone
    if (corTxt)   corTxt.textContent   = `Cor litúrgica: ${data.cor}`
    corBadge.hidden = false
  }
}

function renderLiturgia(root, data) {
  const { leituras = {}, oracoes = {}, antifonas = {} } = data

  const primeiraLeitura = leituras.primeiraLeitura || []
  const segundaLeitura  = leituras.segundaLeitura  || []
  const salmo           = leituras.salmo           || []
  const evangelho       = leituras.evangelho       || []

  const abas = []
  if (primeiraLeitura.length || segundaLeitura.length) abas.push({ id: 'pan-leituras',  icon: '📖', label: 'Leituras' })
  if (salmo.length)           abas.push({ id: 'pan-salmo',    icon: '🎵', label: 'Salmo' })
  if (evangelho.length)       abas.push({ id: 'pan-evangelho',icon: '✝️', label: 'Evangelho' })
  if (oracoes.coleta)         abas.push({ id: 'pan-oracoes',  icon: '🙏', label: 'Orações' })
  if (antifonas.entrada || antifonas.comunhao)
                              abas.push({ id: 'pan-antifonas',icon: '🎶', label: 'Antífonas' })

  if (!abas.length) { renderFallback(root); return }

  const tabsHTML = abas.map((a, i) => `
    <button
      class="liturgia-tab${i === 0 ? ' ativo' : ''}"
      data-panel="${a.id}"
      role="tab"
      aria-selected="${i === 0}"
      aria-controls="${a.id}"
    >
      <span aria-hidden="true">${a.icon}</span> ${a.label}
    </button>`
  ).join('')

  const panelLeituras = `
    <div id="pan-leituras" class="liturgia-panel${abas[0]?.id === 'pan-leituras' ? ' ativo' : ''}" role="tabpanel">
      ${primeiraLeitura.map(l => blocoLeitura('📖 Primeira Leitura', l)).join('')}
      ${segundaLeitura.map(l  => blocoLeitura('📖 Segunda Leitura', l)).join('')}
    </div>`

  const panelSalmo = salmo.length ? `
    <div id="pan-salmo" class="liturgia-panel" role="tabpanel">
      ${salmo.map(s => blocoSalmo(s)).join('')}
    </div>` : ''

  const panelEvangelho = evangelho.length ? `
    <div id="pan-evangelho" class="liturgia-panel" role="tabpanel">
      ${evangelho.map(e => blocoLeitura('✝️ Evangelho', e)).join('')}
    </div>` : ''

  const panelOracoes = oracoes.coleta ? `
    <div id="pan-oracoes" class="liturgia-panel" role="tabpanel">
      ${blocoOracao('Coleta', oracoes.coleta)}
      ${oracoes.oferendas ? blocoOracao('Oração sobre as Oferendas', oracoes.oferendas) : ''}
      ${oracoes.comunhao  ? blocoOracao('Oração após a Comunhão', oracoes.comunhao)     : ''}
      ${(oracoes.extras || []).map((o, i) => blocoOracao(`Extra ${i + 1}`, o)).join('')}
    </div>` : ''

  const panelAntifonas = (antifonas.entrada || antifonas.comunhao) ? `
    <div id="pan-antifonas" class="liturgia-panel" role="tabpanel">
      ${antifonas.entrada  ? blocoOracao('Antífona de Entrada',  antifonas.entrada)  : ''}
      ${antifonas.comunhao ? blocoOracao('Antífona da Comunhão', antifonas.comunhao) : ''}
    </div>` : ''

  root.innerHTML = `
    <div class="liturgia-tabs" role="tablist" aria-label="Seções da liturgia">
      ${tabsHTML}
    </div>
    ${panelLeituras}
    ${panelSalmo}
    ${panelEvangelho}
    ${panelOracoes}
    ${panelAntifonas}
  `

  initTabs(root)
}

function blocoLeitura(titulo, leitura) {
  return `
    <article class="liturgia-bloco" aria-label="${titulo}">
      <p class="liturgia-bloco-titulo"><span aria-hidden="true"></span>${titulo}</p>
      ${leitura.titulo     ? `<p class="liturgia-bloco-subtitulo">${leitura.titulo}</p>` : ''}
      ${leitura.referencia ? `<p class="liturgia-referencia">${leitura.referencia}</p>` : ''}
      <div class="liturgia-versiculo">${formatarTexto(leitura.texto || '')}</div>
    </article>`
}

function blocoSalmo(salmo) {
  return `
    <article class="liturgia-bloco" aria-label="Salmo Responsorial">
      <p class="liturgia-bloco-titulo"><span aria-hidden="true"></span>🎵 Salmo Responsorial</p>
      ${salmo.referencia ? `<p class="liturgia-referencia">${salmo.referencia}</p>` : ''}
      ${salmo.refrao
        ? `<div class="liturgia-antifona" role="note">
            <p class="liturgia-antifona-label">Refrão</p>
            <p>${salmo.refrao}</p>
           </div>`
        : ''}
      <div class="liturgia-versiculo liturgia-salmo-texto">${formatarTexto(salmo.texto || '')}</div>
    </article>`
}

function blocoOracao(titulo, texto) {
  return `
    <article class="liturgia-bloco liturgia-bloco-oracao" aria-label="${titulo}">
      <p class="liturgia-bloco-titulo"><span aria-hidden="true"></span>${titulo}</p>
      <div class="liturgia-versiculo liturgia-oracao-texto">${formatarTexto(texto)}</div>
    </article>`
}

function formatarTexto(texto) {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
}

function renderMisterios(diaSemana) {
  const container = document.getElementById('misterios-hoje')
  if (!container) return

  const m = MISTERIOS[diaSemana]

  container.innerHTML = `
    <h3 class="misterios-titulo">
      🌹 Mistérios ${m.nome} —
      <em>${DIAS_SEMANA[diaSemana]}</em>
    </h3>
    <ol class="misterios-lista" aria-label="Mistérios do Rosário">
      ${m.lista.map((item, i) => `
        <li class="misterio-item">
          <span class="misterio-numero" aria-hidden="true">${i + 1}</span>
          <span>${item}</span>
        </li>`
      ).join('')}
    </ol>`
}

function renderFallback(root) {
  root.innerHTML = `
    <div class="liturgia-fallback" role="alert">
      <span class="liturgia-fallback-icone" aria-hidden="true">🙏</span>
      <h3 class="liturgia-fallback-titulo">Liturgia temporariamente indisponível</h3>
      <p class="liturgia-fallback-desc">
        Não foi possível carregar as leituras automaticamente.<br>
        Acesse um dos sites abaixo para ler a liturgia do dia:
      </p>
      <div class="liturgia-fallback-links">
        <a href="https://www.cnbb.org.br/liturgia-diaria/" target="_blank" rel="noopener noreferrer" class="btn-fallback btn-fallback-primario">
          <i class="fas fa-external-link-alt" aria-hidden="true"></i> CNBB — Liturgia Diária
        </a>
        <a href="https://liturgia.cancaonova.com/" target="_blank" rel="noopener noreferrer" class="btn-fallback">
          <i class="fas fa-external-link-alt" aria-hidden="true"></i> Canção Nova
        </a>
        <a href="https://www.vaticannews.va/pt/liturgia.html" target="_blank" rel="noopener noreferrer" class="btn-fallback">
          <i class="fas fa-external-link-alt" aria-hidden="true"></i> Vatican News
        </a>
      </div>
    </div>`
}
