const estado = {
  testament: 'at',
  livroIdx:  null,
  capitulo:  1,
  dados:     { antigoTestamento: [], novoTestamento: [] },
  carregado: false,
}


function livrosAtual() {
  return estado.testament === 'at'
    ? estado.dados.antigoTestamento
    : estado.dados.novoTestamento
}

function livroAtual() {
  if (estado.livroIdx === null) return null
  return livrosAtual()[estado.livroIdx] || null
}

const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')

async function carregarBiblia() {
  try {
    const res = await fetch('/biblia_ave_maria.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const dados = await res.json()
    estado.dados.antigoTestamento = dados.antigoTestamento || []
    estado.dados.novoTestamento   = dados.novoTestamento   || []
    estado.carregado = true
  } catch (err) {
    console.error('[Bíblia] Erro ao carregar JSON:', err)
    estado.carregado = false
  }
}

function renderLivros(filtro = '') {
  const lista = document.getElementById('biblia-livros-lista')
  if (!lista) return

  const livros = livrosAtual()
  const q = filtro.toLowerCase().trim()
  lista.innerHTML = ''

  const visiveis = livros.filter(l =>
    !q || l.nome.toLowerCase().includes(q)
  )

  if (!visiveis.length) {
    lista.innerHTML = '<p class="biblia-sem-resultados">Nenhum livro encontrado.</p>'
    return
  }

  visiveis.forEach(livro => {
    const idx = livros.indexOf(livro)
    const item = document.createElement('div')
    item.className = 'biblia-livro-item' + (estado.livroIdx === idx ? ' ativo' : '')
    item.setAttribute('role', 'option')
    item.setAttribute('aria-selected', String(estado.livroIdx === idx))
    item.innerHTML = `
      <span>${esc(livro.nome)}</span>
      <span class="biblia-livro-caps">${livro.capitulos.length} cap.</span>
    `
    item.addEventListener('click', () => selecionarLivro(idx))
    lista.appendChild(item)
  })
}

function selecionarLivro(idx) {
  estado.livroIdx = idx
  estado.capitulo = 1
  const busca = document.getElementById('biblia-busca')
  if (busca) busca.value = ''
  renderLivros()
  renderLeitor()
  if (window.innerWidth <= 900) {
    document.getElementById('biblia-leitor')?.scrollIntoView({
      behavior: 'smooth', block: 'start',
    })
  }
}

function renderLeitor() {
  const painel = document.getElementById('biblia-leitor')
  if (!painel) return

  const livro = livroAtual()
  if (!livro) {
    painel.innerHTML = `
      <div class="biblia-vazio">
        <span class="biblia-vazio-icone" aria-hidden="true">✦</span>
        <h3 class="biblia-vazio-titulo">Selecione um livro</h3>
        <p class="biblia-vazio-desc">Escolha um livro na barra lateral para iniciar a leitura.</p>
      </div>`
    return
  }

  const cap = livro.capitulos.find(c => c.capitulo === estado.capitulo)
  const totalCap = livro.capitulos.length
  const totalVers = cap ? cap.versiculos.length : 0
  const testament = estado.testament === 'at' ? 'Antigo Testamento' : 'Novo Testamento'

  const capBtns = Array.from({ length: totalCap }, (_, i) => {
    const n = i + 1
    return `<button class="biblia-cap-btn${n === estado.capitulo ? ' ativo' : ''}"
      data-cap="${n}" aria-label="Capítulo ${n}"
      ${n === estado.capitulo ? 'aria-current="true"' : ''}>${n}</button>`
  }).join('')

  const versiculosHTML = cap
    ? cap.versiculos.map(v => `
        <div class="biblia-versiculo">
          <span class="biblia-versiculo-num" aria-label="Versículo ${v.versiculo}">${v.versiculo}</span>
          <span class="biblia-versiculo-texto">${esc(v.texto)}</span>
        </div>`).join('')
    : '<p style="color:var(--texto-medio);padding:1rem">Capítulo não encontrado.</p>'

  painel.innerHTML = `
    <div class="biblia-livro-header">
      <span class="biblia-livro-tag">${esc(testament)}</span>
      <h2 class="biblia-livro-nome">${esc(livro.nome)}</h2>
      <p class="biblia-livro-meta">
        <span><i class="fas fa-book-open" aria-hidden="true"></i> Capítulo ${estado.capitulo} de ${totalCap}</span>
        <span><i class="fas fa-align-justify" aria-hidden="true"></i> ${totalVers} versículos</span>
      </p>
    </div>

    <div class="biblia-cap-nav" aria-label="Navegação por capítulos">
      <span class="biblia-cap-label">Capítulos</span>
      <div class="biblia-cap-lista" role="group" aria-label="Capítulos disponíveis">
        ${capBtns}
      </div>
      <div class="biblia-prev-next">
        <button class="biblia-prev-next-btn" id="biblia-btn-anterior"
          aria-label="Capítulo anterior"
          ${estado.capitulo <= 1 ? 'disabled' : ''}>
          <i class="fas fa-chevron-left" aria-hidden="true"></i> Ant.
        </button>
        <button class="biblia-prev-next-btn" id="biblia-btn-proximo"
          aria-label="Próximo capítulo"
          ${estado.capitulo >= totalCap ? 'disabled' : ''}>
          Próx. <i class="fas fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <div class="biblia-versiculos" role="list" aria-label="${esc(livro.nome)} capítulo ${estado.capitulo}">
      ${versiculosHTML}
    </div>

    <div class="biblia-leitor-rodape">
      <span class="biblia-rodape-info">
        ${esc(livro.nome)} ${estado.capitulo}:1–${totalVers} · Bíblia Ave Maria
      </span>
      <button class="biblia-topo-btn" id="biblia-btn-topo">
        <i class="fas fa-arrow-up" aria-hidden="true"></i> Início
      </button>
    </div>
  `

  painel.querySelectorAll('.biblia-cap-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      estado.capitulo = parseInt(btn.dataset.cap, 10)
      renderLeitor()
      scrollTopo()
    })
  })

  painel.querySelector('#biblia-btn-anterior')?.addEventListener('click', () => {
    if (estado.capitulo > 1) {
      estado.capitulo--
      renderLeitor()
      scrollTopo()
    }
  })

  painel.querySelector('#biblia-btn-proximo')?.addEventListener('click', () => {
    if (estado.capitulo < totalCap) {
      estado.capitulo++
      renderLeitor()
      scrollTopo()
    }
  })

  painel.querySelector('#biblia-btn-topo')?.addEventListener('click', scrollTopo)
}

function scrollTopo() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export async function initBibliaPage() {
  const raiz = document.getElementById('biblia-leitor')
  if (!raiz) return

  await carregarBiblia()

  document.querySelectorAll('.biblia-testament-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.biblia-testament-tab').forEach(t => {
        t.classList.remove('ativo')
        t.setAttribute('aria-selected', 'false')
      })
      tab.classList.add('ativo')
      tab.setAttribute('aria-selected', 'true')
      estado.testament = tab.dataset.testament
      estado.livroIdx  = null
      estado.capitulo  = 1
      renderLivros()
      renderLeitor()
    })
  })

  document.getElementById('biblia-busca')?.addEventListener('input', e => {
    renderLivros(e.target.value)
  })

  renderLivros()

  if (estado.dados.antigoTestamento.length > 0) {
    selecionarLivro(0)
  } else {
    renderLeitor()
  }
}