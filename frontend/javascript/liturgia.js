/**
 * liturgia.js — schema YAML unificado
 */

import { initTabs } from './tabs.js'

const API_BASE = 'https://liturgia.up.railway.app/v2/'

// ──────────────────────────────────────────────
// Constantes litúrgicas
// ──────────────────────────────────────────────

const DIALOGO_INICIAL = [
  { papel: 'celebrante', texto: 'O Senhor esteja convosco.' },
  { papel: 'assembleia', texto: 'Ele está no meio de nós.' },
  { papel: 'celebrante', texto: 'Corações ao alto.' },
  { papel: 'assembleia', texto: 'O nosso coração está em Deus.' },
  { papel: 'celebrante', texto: 'Demos graças ao Senhor, nosso Deus.' },
  { papel: 'assembleia', texto: 'É nosso dever e nossa salvação.' },
]

const SANCTUS =
  'Santo, Santo, Santo, Senhor Deus do universo!\n' +
  'O céu e a terra proclamam a vossa glória.\n' +
  'Hosana nas alturas!\n' +
  'Bendito o que vem em nome do Senhor!\n' +
  'Hosana nas alturas!'

const ACLAMACOES_PADRAO = [
  'Anunciamos, Senhor, a vossa morte e proclamamos a vossa ressurreição.\nVinde, Senhor Jesus!',
  'Todas as vezes que comemos deste pão e bebemos deste cálice,\nanunciamos, Senhor, a vossa morte,\nenquanto esperamos a vossa vinda!',
  'Salvador do mundo, salvai-nos,\nvós que nos libertastes pela cruz e ressurreição.',
]

const DOXOLOGIA =
  'Por Cristo, com Cristo e em Cristo,\n' +
  'a vós, Deus Pai todo-poderoso,\n' +
  'na unidade do Espírito Santo,\n' +
  'toda honra e toda glória,\n' +
  'por todos os séculos dos séculos.'

// ──────────────────────────────────────────────
// Grupos e títulos de seção
// ──────────────────────────────────────────────

const GRUPOS_OE = {
  ordinario:     { label: 'Ordinário',               icon: '✝️',  ordem: 1 },
  diversas:      { label: 'Diversas Circunstâncias', icon: '🌍',  ordem: 2 },
  criancas:      { label: 'Para Crianças',            icon: '🌸',  ordem: 3 },
  reconciliacao: { label: 'Reconciliação',            icon: '🕊️', ordem: 4 },
}

const TITULOS_SECAO = {
  dialogo:            'Diálogo Introdutório',
  prefacio:           'Prefácio',
  epiclese:           'Invocação do Espírito Santo',
  consagracao_pao:    'Consagração do Pão',
  consagracao_calice: 'Consagração do Cálice',
  aclamacao_memorial: 'Aclamação Memorial',
  pos_consagracao:    'Anamnese e Intercessões',
  doxologia:          'Doxologia Final',
}

// ──────────────────────────────────────────────
// Localização
// ──────────────────────────────────────────────

const DIAS_SEMANA = [
  'Domingo','Segunda-feira','Terça-feira','Quarta-feira',
  'Quinta-feira','Sexta-feira','Sábado',
]
const MESES = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
]

const COR_CONFIG = {
  'Roxo':     { cls: 'cor-roxo',    icone: '🟣' },
  'Branco':   { cls: 'cor-branco',  icone: '⚪' },
  'Verde':    { cls: 'cor-verde',   icone: '🟢' },
  'Vermelho': { cls: 'cor-vermelho',icone: '🔴' },
  'Rosa':     { cls: 'cor-rosa',    icone: '🌸' },
  'Dourado':  { cls: 'cor-dourado', icone: '🟡' },
}

// ──────────────────────────────────────────────
// Estado
// ──────────────────────────────────────────────

let dataAtual = new Date()
dataAtual.setHours(0, 0, 0, 0)
const cacheAPI = {}

// ──────────────────────────────────────────────
// Utilitários
// ──────────────────────────────────────────────

const esc   = s => s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''
const nl2br = s => esc(s).replace(/\n/g, '<br>')

function formatarDataLabel(date) {
  return `${DIAS_SEMANA[date.getDay()]}, ${date.getDate()} de ${MESES[date.getMonth()]} de ${date.getFullYear()}`
}
function toChave(date) {
  return `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`
}
function hoje() {
  const d = new Date(); d.setHours(0,0,0,0); return d
}

// ──────────────────────────────────────────────
// Navegação
// ──────────────────────────────────────────────

function atualizarBotoes() {
  const btnProx = document.getElementById('btn-proximo')
  const btnAnt  = document.getElementById('btn-anterior')
  if (btnProx) btnProx.disabled = dataAtual >= hoje()
  if (btnAnt) {
    const limite = new Date(hoje()); limite.setDate(limite.getDate() - 30)
    btnAnt.disabled = dataAtual <= limite
  }
}

// ──────────────────────────────────────────────
// Init
// ──────────────────────────────────────────────

export function initLiturgiaPage() {
  const root = document.getElementById('liturgia-content')
  if (!root) return

  const badge = document.getElementById('liturgia-data-hoje')
  if (badge) badge.textContent = formatarDataLabel(dataAtual)

  atualizarBotoes()
  carregarLiturgia(root, dataAtual)

  document.getElementById('btn-anterior')?.addEventListener('click', () => {
    if (document.getElementById('btn-anterior')?.disabled) return
    dataAtual = new Date(dataAtual)
    dataAtual.setDate(dataAtual.getDate() - 1)
    if (badge) badge.textContent = formatarDataLabel(dataAtual)
    atualizarBotoes()
    carregarLiturgia(root, dataAtual)
  })

  document.getElementById('btn-proximo')?.addEventListener('click', () => {
    if (dataAtual >= hoje()) return
    dataAtual = new Date(dataAtual)
    dataAtual.setDate(dataAtual.getDate() + 1)
    if (badge) badge.textContent = formatarDataLabel(dataAtual)
    atualizarBotoes()
    carregarLiturgia(root, dataAtual)
  })
}

// ──────────────────────────────────────────────
// Carregamento das leituras
// ──────────────────────────────────────────────

async function carregarLiturgia(root, date) {
  const corBadge = document.getElementById('liturgia-cor-badge')
  if (corBadge) { corBadge.className = 'liturgia-cor-badge'; corBadge.hidden = true }
  const tempoEl = document.getElementById('liturgia-tempo')
  if (tempoEl) tempoEl.hidden = true

  const chave = toChave(date)
  let data = window.LITURGIA_DATA?.[chave]

  if (!data) {
    renderLoading(root)
    data = cacheAPI[chave] ?? (await buscarDaAPI(date))
    if (data) cacheAPI[chave] = data
  }

  if (!data) { renderFallback(root); return }
  data = normalizarEstrutura(data)
  preencherMeta(data)
  renderLiturgia(root, data)
}

async function buscarDaAPI(date) {
  try {
    const r = await fetch(
      `${API_BASE}?dia=${date.getDate()}&mes=${date.getMonth()+1}&ano=${date.getFullYear()}`
    )
    if (!r.ok) return null
    const j = await r.json()
    return j?.erro ? null : j
  } catch { return null }
}

function normalizarEstrutura(d) {
  if (d.leituras || d.oracoes) return d
  const toArr = v => !v ? [] : Array.isArray(v) ? v : typeof v === 'object' ? [v] : []
  return {
    data:      d.data,
    liturgia:  d.liturgia,
    cor:       d.cor,
    leituras: {
      primeiraLeitura: toArr(d.primeiraLeitura),
      segundaLeitura:  toArr(d.segundaLeitura),
      salmo:           toArr(d.salmo),
      evangelho:       toArr(d.evangelho),
      extras:          [],
    },
    oracoes: {
      coleta:    d.dia       || null,
      oferendas: d.oferendas || null,
      comunhao:  d.comunhao  || null,
      extras:    [],
    },
    antifonas: d.antifonas || {},
  }
}

// ──────────────────────────────────────────────
// Meta (cor litúrgica / tempo)
// ──────────────────────────────────────────────

function preencherMeta(data) {
  const tempoEl  = document.getElementById('liturgia-tempo')
  const tempoTxt = document.getElementById('liturgia-tempo-texto')
  if (tempoEl && tempoTxt && data.liturgia) {
    tempoTxt.textContent = data.liturgia
    tempoEl.hidden = false
  }

  const corBadge = document.getElementById('liturgia-cor-badge')
  if (corBadge && data.cor) {
    const cfg      = COR_CONFIG[data.cor] || { cls: '', icone: '●' }
    const corIcone = document.getElementById('liturgia-cor-icone')
    const corTxt   = document.getElementById('liturgia-cor-texto')
    corBadge.classList.add(cfg.cls)
    if (corIcone) corIcone.textContent = cfg.icone
    if (corTxt)   corTxt.textContent   = `Cor litúrgica: ${data.cor}`
    corBadge.hidden = false
  }
}

// ──────────────────────────────────────────────
// Render principal — abas separadas
// ──────────────────────────────────────────────

function renderLiturgia(root, data) {
  const { leituras = {}, oracoes = {}, antifonas = {} } = data
  const temLeituras = (leituras.primeiraLeitura||[]).length
    || (leituras.segundaLeitura||[]).length
    || (leituras.extras||[]).filter(l => l.tipo).length
  const salmo   = leituras.salmo     || []
  const ev      = leituras.evangelho || []
  const extrasO = Array.isArray(oracoes.extras) ? oracoes.extras : []

  // ── Abas das leituras (topo) ──
  const abasLeitura = []
  if (temLeituras)                           abasLeitura.push({ id:'pan-leituras',  icon:'📖', label:'Leituras' })
  if (salmo.length)                          abasLeitura.push({ id:'pan-salmo',     icon:'🎵', label:'Salmo' })
  if (ev.length)                             abasLeitura.push({ id:'pan-evangelho', icon:'✝️', label:'Evangelho' })
  if (oracoes.coleta)                        abasLeitura.push({ id:'pan-oracoes',   icon:'🙏', label:'Orações' })
  if (antifonas.entrada||antifonas.comunhao) abasLeitura.push({ id:'pan-antifonas',icon:'🎶', label:'Antífonas' })

  // ── Abas da missa (final da página) ──
  const abasMissa = [
    { id:'pan-oe',     icon:'🕊️', label:'Or. Eucarísticas' },
    { id:'pan-rito',   icon:'🍞',  label:'Rito da Comunhão' },
    { id:'pan-bencao', icon:'✠',   label:'Bênçãos Finais'   },
  ]

  // FIX 2: a primeira aba ativa é sempre a primeira das LEITURAS.
  // Os painéis da missa nunca devem ser ativados por padrão —
  // eles ficam ocultos (display:none via .liturgia-panel sem .ativo)
  // até o usuário clicar nas tabs da missa no rodapé.
  const primeiraLeituraId = abasLeitura[0]?.id || null
  const primeiraMissaId   = null  // nenhuma tab da missa ativa por padrão

  // buildTabs aceita um activeId explícito para cada grupo
  const buildTabs = (abas, activeId) => abas.map(a => `
    <button class="liturgia-tab${a.id === activeId ? ' ativo' : ''}"
      data-panel="${a.id}" role="tab"
      aria-selected="${String(a.id === activeId)}"
      aria-controls="${a.id}">
      <span aria-hidden="true">${a.icon}</span> ${a.label}
    </button>`).join('')

  root.innerHTML = `

    <!-- ── Abas de leituras (topo) ── -->
    <div class="liturgia-tabs" role="tablist" aria-label="Leituras do dia">
      ${buildTabs(abasLeitura, primeiraLeituraId)}
    </div>

    <!-- ── Painéis de leituras ── -->
    <div id="pan-leituras"
      class="liturgia-panel${primeiraLeituraId === 'pan-leituras' ? ' ativo' : ''}"
      role="tabpanel">
      ${(leituras.primeiraLeitura||[]).map(l => blocoLeitura('📖 Primeira Leitura', l)).join('')}
      ${(leituras.segundaLeitura||[]).map(l  => blocoLeitura('📖 Segunda Leitura', l)).join('')}
      ${(leituras.extras||[]).filter(l=>l.tipo).map(l => blocoLeitura(`📖 ${l.tipo}`, l)).join('')}
    </div>

    ${salmo.length ? `<div id="pan-salmo"
      class="liturgia-panel${primeiraLeituraId === 'pan-salmo' ? ' ativo' : ''}"
      role="tabpanel">
      ${salmo.map(s => blocoSalmo(s)).join('')}
    </div>` : ''}

    ${ev.length ? `<div id="pan-evangelho"
      class="liturgia-panel${primeiraLeituraId === 'pan-evangelho' ? ' ativo' : ''}"
      role="tabpanel">
      ${ev.map(e => blocoLeitura('✝️ Evangelho', e)).join('')}
    </div>` : ''}

    ${oracoes.coleta ? `<div id="pan-oracoes"
      class="liturgia-panel${primeiraLeituraId === 'pan-oracoes' ? ' ativo' : ''}"
      role="tabpanel">
      ${blocoOracao('Coleta', oracoes.coleta)}
      ${oracoes.oferendas ? blocoOracao('Oração sobre as Oferendas', oracoes.oferendas) : ''}
      ${oracoes.comunhao  ? blocoOracao('Oração após a Comunhão', oracoes.comunhao) : ''}
      ${extrasO.map(o => blocoOracao(o.titulo||'Oração extra', o.texto)).join('')}
    </div>` : ''}

    ${(antifonas.entrada||antifonas.comunhao) ? `<div id="pan-antifonas"
      class="liturgia-panel${primeiraLeituraId === 'pan-antifonas' ? ' ativo' : ''}"
      role="tabpanel">
      ${antifonas.entrada  ? blocoOracao('Antífona de Entrada', antifonas.entrada)  : ''}
      ${antifonas.comunhao ? blocoOracao('Antífona da Comunhão', antifonas.comunhao) : ''}
    </div>` : ''}

    <!-- ── Divisor ── -->
    <div class="liturgia-missa-divisor" aria-hidden="true">
      <span>Orações da Santa Missa</span>
    </div>

    <!-- ── Abas da missa (final da página) ── -->
    <div class="liturgia-tabs liturgia-tabs-missa" role="tablist" aria-label="Orações da Missa">
      ${buildTabs(abasMissa, primeiraMissaId)}
    </div>

    <!-- ── Painéis da missa (ficam ocultos até serem ativados pelas tabs acima) ── -->
    ${renderPanelOracoesEucaristicas()}
    ${renderPanelRito()}
    ${renderPanelBencaos()}
  `

  initTabs(root)
  initAcordeaoOE(root)
}

// ──────────────────────────────────────────────
// Blocos de leitura / oração
// ──────────────────────────────────────────────

function blocoLeitura(titulo, l) {
  if (!l || typeof l !== 'object') return ''
  return `<article class="liturgia-bloco" aria-label="${titulo}">
    <p class="liturgia-bloco-titulo">${titulo}</p>
    ${l.titulo     ? `<p class="liturgia-bloco-subtitulo">${esc(l.titulo)}</p>`  : ''}
    ${l.referencia ? `<p class="liturgia-referencia">${esc(l.referencia)}</p>`   : ''}
    <div class="liturgia-versiculo">${nl2br(l.texto||'')}</div>
  </article>`
}

function blocoSalmo(s) {
  if (!s || typeof s !== 'object') return ''
  return `<article class="liturgia-bloco" aria-label="Salmo Responsorial">
    <p class="liturgia-bloco-titulo">🎵 Salmo Responsorial</p>
    ${s.referencia ? `<p class="liturgia-referencia">${esc(s.referencia)}</p>` : ''}
    ${s.refrao ? `<div class="liturgia-antifona" role="note">
      <p class="liturgia-antifona-label">Refrão</p>
      <p>${nl2br(s.refrao)}</p>
    </div>` : ''}
    <div class="liturgia-versiculo liturgia-salmo-texto">${nl2br(s.texto||'')}</div>
  </article>`
}

function blocoOracao(titulo, texto) {
  if (!texto || typeof texto !== 'string') return ''
  return `<article class="liturgia-bloco liturgia-bloco-oracao" aria-label="${titulo}">
    <p class="liturgia-bloco-titulo">${titulo}</p>
    <div class="liturgia-versiculo liturgia-oracao-texto">${nl2br(texto)}</div>
  </article>`
}

// ──────────────────────────────────────────────
// Painel: Orações Eucarísticas
// ──────────────────────────────────────────────

function renderPanelOracoesEucaristicas() {
  const fonte = window.ORACOES_DATA || []
  const oes = fonte
    .filter(o => o.grupo && GRUPOS_OE[o.grupo])
    .sort((a, b) => {
      const dg = GRUPOS_OE[a.grupo].ordem - GRUPOS_OE[b.grupo].ordem
      return dg !== 0 ? dg : (a.ordem||0) - (b.ordem||0)
    })

  if (!oes.length) return `<div id="pan-oe" class="liturgia-panel" role="tabpanel">
    <p class="oe-vazio">Orações Eucarísticas não carregadas.</p>
  </div>`

  const porGrupo = {}
  oes.forEach(oe => {
    if (!porGrupo[oe.grupo]) porGrupo[oe.grupo] = []
    porGrupo[oe.grupo].push(oe)
  })
  const gruposOrdenados = Object.keys(porGrupo).sort(
    (a, b) => GRUPOS_OE[a].ordem - GRUPOS_OE[b].ordem
  )

  const gruposHTML = gruposOrdenados.map(g => {
    const cfg = GRUPOS_OE[g]
    return `
      <div class="oe-grupo-secao" data-oe-grupo="${g}">
        <p class="oe-grupo-label">
          <span aria-hidden="true">${cfg.icon}</span> ${cfg.label}
        </p>
        ${porGrupo[g].map(oe => renderOE(oe)).join('')}
      </div>`
  }).join('')

  return `
    <div id="pan-oe" class="liturgia-panel" role="tabpanel" aria-label="Orações Eucarísticas">
      <div class="oe-intro liturgia-bloco">
        <p class="liturgia-bloco-titulo">🕊️ Orações Eucarísticas</p>
        <p class="oe-intro-desc">
          O coração da Santa Missa — o momento em que o pão e o vinho
          tornam-se o Corpo e o Sangue de Cristo.
          Expanda a oração desejada para acompanhar suas partes.
        </p>
      </div>
      <div class="oe-grupos-lista">${gruposHTML}</div>
    </div>`
}

// ──────────────────────────────────────────────
// Painel: Rito da Comunhão
// ──────────────────────────────────────────────

function renderPanelRito() {
  const rito = window.RITO_DATA
  if (!rito) return `<div id="pan-rito" class="liturgia-panel" role="tabpanel">
    <p class="oe-vazio">Rito da Comunhão não carregado.</p>
  </div>`

  const secoes = [
    renderRitoSecao('Pai Nosso', rito.pai_nosso ? renderPartesList([
      ...rito.pai_nosso.introducao,
      ...rito.pai_nosso.oracao,
      ...rito.pai_nosso.embolismo,
      ...rito.pai_nosso.doxologia,
    ]) : ''),
    renderRitoSecao('Oração pela Paz', renderPartesList(rito.oracao_pela_paz || [])),
    renderRitoSecao('Rito da Paz',     renderPartesList(rito.rito_da_paz     || [])),
    renderRitoSecao('Fração do Pão',   renderPartesList([
      ...(rito.fracao_do_pao?.introducao || []),
      ...(rito.fracao_do_pao?.cordeiro   || []),
    ])),
    renderRitoSecao('Comunhão', renderPartesList([
      ...(rito.comunhao?.oracao_privada || []),
      ...(rito.comunhao?.convite        || []),
      ...(rito.comunhao?.resposta       || []),
    ])),
  ].join('')

  return `
    <div id="pan-rito" class="liturgia-panel" role="tabpanel" aria-label="Rito da Comunhão">
      <div class="oe-intro liturgia-bloco">
        <p class="liturgia-bloco-titulo">🍞 Rito da Comunhão</p>
        <p class="oe-intro-desc">
          Da Oração do Senhor à recepção da Eucaristia —
          os ritos que nos preparam para comungar o Corpo e o Sangue de Cristo.
        </p>
      </div>
      <div class="oe-secoes">${secoes}</div>
    </div>`
}

function renderRitoSecao(titulo, conteudoHTML) {
  return `
    <div class="oe-secao">
      <button class="oe-secao-header" aria-expanded="false" data-oe-toggle>
        <span class="oe-secao-titulo">${esc(titulo)}</span>
        <span class="oe-secao-chevron" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
      </button>
      <div class="oe-secao-body">
        <div class="oe-partes">${conteudoHTML}</div>
      </div>
    </div>`
}

// ──────────────────────────────────────────────
// Painel: Bênçãos Finais
// ──────────────────────────────────────────────

function renderPanelBencaos() {
  const lista = window.BENCAOS_DATA || []
  if (!lista.length) return `<div id="pan-bencao" class="liturgia-panel" role="tabpanel">
    <p class="oe-vazio">Bênçãos finais não carregadas.</p>
  </div>`

  const bencaosHTML = lista.map((b, i) => `
    <details class="oe-oracao" name="bencao-grupo">
      <summary class="oe-oracao-header">
        <span class="oe-numero">${i+1}</span>
        <span class="oe-oracao-info">
          <span class="oe-oracao-titulo">${esc(b.titulo)}</span>
          ${b.subtitulo ? `<span class="oe-oracao-subtitulo">${esc(b.subtitulo)}</span>` : ''}
        </span>
        <span class="oe-oracao-chevron" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
      </summary>
      <div class="oe-oracao-body">
        <div class="oe-partes">${renderPartesList(b.partes || [])}</div>
      </div>
    </details>`).join('')

  return `
    <div id="pan-bencao" class="liturgia-panel" role="tabpanel" aria-label="Bênçãos Finais">
      <div class="oe-intro liturgia-bloco">
        <p class="liturgia-bloco-titulo">✠ Bênçãos Finais</p>
        <p class="oe-intro-desc">
          O envio da assembleia — a bênção que nos manda ao mundo
          para viver o que celebramos.
        </p>
      </div>
      <div class="oe-grupos-lista">
        <div class="oe-grupo-secao">${bencaosHTML}</div>
      </div>
    </div>`
}

// ──────────────────────────────────────────────
// Renderização de cada OE
// ──────────────────────────────────────────────

function renderOE(oe) {
  const secoes = (oe.secoes || []).map(s => renderSecao(s)).join('')
  return `
    <details class="oe-oracao" name="oe-grupo-${oe.grupo}">
      <summary class="oe-oracao-header">
        <span class="oe-numero">${oe.ordem || '·'}</span>
        <span class="oe-oracao-info">
          <span class="oe-oracao-titulo">${esc(oe.titulo)}</span>
          ${oe.subtitulo ? `<span class="oe-oracao-subtitulo">${esc(oe.subtitulo)}</span>` : ''}
        </span>
        <span class="oe-oracao-chevron" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
      </summary>
      <div class="oe-oracao-body">
        ${oe.nota ? `<p class="oe-nota"><span aria-hidden="true">ℹ️</span> ${esc(oe.nota)}</p>` : ''}
        <div class="oe-secoes">${secoes}</div>
      </div>
    </details>`
}

function renderSecao(secao) {
  switch (secao.tipo) {
    case 'dialogo':            return renderSecaoDialogo()
    case 'prefacio':           return renderSecaoComPartes(secao, 'oe-prefacio', true)
    case 'epiclese':           return renderSecaoComPartes(secao, 'oe-epiclese')
    case 'consagracao_pao':    return renderSecaoConsagracao(secao, 'Pão')
    case 'consagracao_calice': return renderSecaoConsagracao(secao, 'Cálice')
    case 'aclamacao_memorial': return renderSecaoAclamacao(secao)
    case 'pos_consagracao':    return renderSecaoComPartes(secao, 'oe-pos-consagracao')
    case 'doxologia':          return renderSecaoDoxologia()
    default:                   return renderSecaoComPartes(secao, '')
  }
}

function renderSecaoDialogo() {
  return `
    <div class="oe-secao oe-dialogo">
      <button class="oe-secao-header" aria-expanded="false" data-oe-toggle>
        <span class="oe-secao-titulo">${TITULOS_SECAO.dialogo}</span>
        <span class="oe-secao-chevron" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
      </button>
      <div class="oe-secao-body">
        <div class="oe-partes">${DIALOGO_INICIAL.map(renderParte).join('')}</div>
      </div>
    </div>`
}

function renderSecaoComPartes(secao, extraClass, addSanctus = false) {
  const titulo  = secao.titulo || TITULOS_SECAO[secao.tipo] || secao.tipo
  const partes  = (secao.partes || []).map(renderParte).join('')
  const sanctus = addSanctus ? `
    <div class="oe-sanctus-inline">
      <p class="oe-sanctus-label">Sanctus</p>
      <p class="oe-sanctus-texto">${nl2br(SANCTUS)}</p>
    </div>` : ''

  return `
    <div class="oe-secao${extraClass ? ` ${extraClass}` : ''}">
      <button class="oe-secao-header" aria-expanded="false" data-oe-toggle>
        <span class="oe-secao-titulo">${esc(titulo)}</span>
        <span class="oe-secao-chevron" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
      </button>
      <div class="oe-secao-body">
        <div class="oe-partes">${partes}</div>
        ${sanctus}
      </div>
    </div>`
}

function renderSecaoConsagracao(secao, elemento) {
  const titulo = secao.titulo || `${TITULOS_SECAO[secao.tipo] || 'Consagração'} — ${elemento}`
  return `
    <div class="oe-secao oe-consagracao">
      <button class="oe-secao-header" aria-expanded="false" data-oe-toggle>
        <span class="oe-secao-titulo">${esc(titulo)}</span>
        <span class="oe-secao-chevron" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
      </button>
      <div class="oe-secao-body">
        ${secao.introducao ? `<p class="oe-consagracao-intro">${nl2br(secao.introducao)}</p>` : ''}
        ${secao.texto      ? `<p class="oe-consagracao-palavras">${nl2br(secao.texto)}</p>`   : ''}
      </div>
    </div>`
}

function renderSecaoAclamacao(secao) {
  const opcoes     = secao.opcoes?.length ? secao.opcoes : ACLAMACOES_PADRAO
  const opcoesHTML = opcoes.map((o, i) => `
    <div class="oe-aclamacao-opcao">
      <span class="oe-aclamacao-num">${i+1}</span>
      <p class="oe-parte-assembleia-texto">${nl2br(o)}</p>
    </div>`).join('')

  return `
    <div class="oe-secao oe-aclamacao">
      <button class="oe-secao-header" aria-expanded="false" data-oe-toggle>
        <span class="oe-secao-titulo">Aclamação Memorial — "Eis o mistério da fé!"</span>
        <span class="oe-secao-chevron" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
      </button>
      <div class="oe-secao-body">
        <p class="oe-aclamacao-instrucao">
          O sacerdote proclama: <em>"Eis o mistério da fé!"</em> —
          o povo responde com uma das aclamações:
        </p>
        <div class="oe-aclamacao-opcoes">${opcoesHTML}</div>
      </div>
    </div>`
}

function renderSecaoDoxologia() {
  return `
    <div class="oe-secao oe-doxologia">
      <button class="oe-secao-header" aria-expanded="false" data-oe-toggle>
        <span class="oe-secao-titulo">Doxologia Final</span>
        <span class="oe-secao-chevron" aria-hidden="true"><i class="fas fa-chevron-down"></i></span>
      </button>
      <div class="oe-secao-body">
        <p class="oe-doxologia-texto">${nl2br(DOXOLOGIA)}</p>
        <div class="oe-parte oe-parte-assembleia">
          <span class="oe-papel-badge">Assembleia</span>
          <p class="oe-parte-assembleia-texto">Amém.</p>
        </div>
      </div>
    </div>`
}

function renderParte(parte) {
  const { papel, texto } = parte
  if (!texto) return ''
  if (papel === 'rubrica') {
    return `<p class="oe-rubrica">${nl2br(texto)}</p>`
  }
  if (papel === 'assembleia') {
    return `<div class="oe-parte oe-parte-assembleia">
      <span class="oe-papel-badge">Assembleia</span>
      <p class="oe-parte-assembleia-texto">${nl2br(texto)}</p>
    </div>`
  }
  return `<div class="oe-parte oe-parte-celebrante">
    <p class="oe-parte-celebrante-texto">${nl2br(texto)}</p>
  </div>`
}

function renderPartesList(partes) {
  return (partes || []).map(renderParte).join('')
}

// ──────────────────────────────────────────────
// Init acordeão
// ──────────────────────────────────────────────

function initAcordeaoOE(root) {
  root.querySelectorAll('[data-oe-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true'
      btn.setAttribute('aria-expanded', String(!expanded))
      btn.nextElementSibling?.classList.toggle('aberto', !expanded)
    })
  })
}

// ──────────────────────────────────────────────
// Loading / Fallback
// ──────────────────────────────────────────────

function renderLoading(root) {
  root.innerHTML = `<div class="liturgia-loading" role="status">
    <div class="spinner" aria-hidden="true"></div>
    <p>Buscando a liturgia do dia…</p>
  </div>`
}

function renderFallback(root) {
  root.innerHTML = `<div class="liturgia-fallback" role="alert">
    <span class="liturgia-fallback-icone" aria-hidden="true">🙏</span>
    <h3 class="liturgia-fallback-titulo">Liturgia temporariamente indisponível</h3>
    <p class="liturgia-fallback-desc">
      Não foi possível carregar as leituras automaticamente.<br>
      Acesse um dos sites abaixo para ler a liturgia do dia:
    </p>
    <div class="liturgia-fallback-links">
      <a href="https://www.cnbb.org.br/liturgia-diaria/" target="_blank" rel="noopener noreferrer"
         class="btn-fallback btn-fallback-primario">
        <i class="fas fa-external-link-alt" aria-hidden="true"></i> CNBB — Liturgia Diária
      </a>
      <a href="https://liturgia.cancaonova.com/" target="_blank" rel="noopener noreferrer"
         class="btn-fallback">
        <i class="fas fa-external-link-alt" aria-hidden="true"></i> Canção Nova
      </a>
      <a href="https://www.vaticannews.va/pt/liturgia.html" target="_blank" rel="noopener noreferrer"
         class="btn-fallback">
        <i class="fas fa-external-link-alt" aria-hidden="true"></i> Vatican News
      </a>
    </div>
  </div>`
}
