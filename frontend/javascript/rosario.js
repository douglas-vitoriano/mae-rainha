const DIAS_SEMANA = [
  'Domingo','Segunda-feira','Terça-feira','Quarta-feira',
  'Quinta-feira','Sexta-feira','Sábado',
]

const MISTERIOS = {
  0: {
    nome: 'Gloriosos', icone: '✨', cor: 'dourado',
    lista: [
      { num: 1, titulo: 'Ressurreição de Jesus',
        meditacao: 'Jesus ressuscita glorioso dos mortos, vence a morte e nos dá a esperança da vida eterna.' },
      { num: 2, titulo: 'Ascensão de Jesus ao Céu',
        meditacao: 'Jesus sobe aos céus e se senta à direita do Pai, prometendo enviar o Espírito Santo.' },
      { num: 3, titulo: 'Descida do Espírito Santo — Pentecostes',
        meditacao: 'O Espírito Santo desce sobre Maria e os Apóstolos, dando-lhes força para proclamar o Evangelho.' },
      { num: 4, titulo: 'Assunção de Maria ao Céu',
        meditacao: 'Maria é elevada em corpo e alma à glória do Paraíso, como primícias da ressurreição.' },
      { num: 5, titulo: 'Coroação de Maria Rainha do Universo',
        meditacao: 'Maria é coroada Rainha dos céus e da terra, intercedendo por nós junto ao seu Filho.' },
    ],
  },
  1: {
    nome: 'Gozosos', icone: '🌟', cor: 'verde',
    lista: [
      { num: 1, titulo: 'Anunciação do Anjo Gabriel a Maria',
        meditacao: 'O Anjo Gabriel anuncia a Maria que ela conceberá o Filho de Deus pelo Espírito Santo.' },
      { num: 2, titulo: 'Visitação de Maria a Isabel',
        meditacao: 'Maria visita Isabel e João Batista tressalta de alegria no seio de sua mãe.' },
      { num: 3, titulo: 'Nascimento de Jesus em Belém',
        meditacao: 'Jesus nasce pobre em Belém, trazendo ao mundo a luz e a paz que anunciam os anjos.' },
      { num: 4, titulo: 'Apresentação de Jesus no Templo',
        meditacao: 'José e Maria oferecem Jesus no Templo; Simeão e Ana reconhecem nele o Salvador.' },
      { num: 5, titulo: 'Encontro de Jesus no Templo',
        meditacao: 'Jesus, aos 12 anos, é encontrado no Templo dialogando com os doutores da Lei.' },
    ],
  },
  2: {
    nome: 'Dolorosos', icone: '✝️', cor: 'vermelho',
    lista: [
      { num: 1, titulo: 'Agonia de Jesus no Horto',
        meditacao: 'Jesus ora angustiado no Getsêmani, aceitando a vontade do Pai: "Não a minha, mas a tua vontade."' },
      { num: 2, titulo: 'Flagelação de Jesus na Coluna',
        meditacao: 'Jesus é flagelado cruelmente por nossos pecados, cumprindo a profecia do Servo Sofredor.' },
      { num: 3, titulo: 'Coroação de Espinhos',
        meditacao: 'Os soldados coroam Jesus com espinhos, zombando de sua realeza que é de amor e serviço.' },
      { num: 4, titulo: 'Jesus Carrega a Cruz',
        meditacao: 'Jesus carrega a cruz até o Calvário, encontrando sua Mãe e as mulheres de Jerusalém.' },
      { num: 5, titulo: 'Crucificação e Morte de Jesus',
        meditacao: 'Jesus é crucificado e morre na cruz, entregando ao Pai seu espírito e nos dando Maria como Mãe.' },
    ],
  },
  3: {
    nome: 'Luminosos', icone: '💡', cor: 'azul',
    lista: [
      { num: 1, titulo: 'Batismo de Jesus no Rio Jordão',
        meditacao: 'Jesus é batizado por João; o Pai declara "Este é meu Filho amado" e o Espírito desce sobre ele.' },
      { num: 2, titulo: 'Bodas de Caná',
        meditacao: 'A pedido de Maria, Jesus transforma água em vinho — o primeiro sinal que manifesta sua glória.' },
      { num: 3, titulo: 'Anúncio do Reino de Deus',
        meditacao: 'Jesus proclama o Reino e convida à conversão: "Convertei-vos e crede no Evangelho."' },
      { num: 4, titulo: 'Transfiguração no Monte Tabor',
        meditacao: 'Jesus resplandece diante de Pedro, Tiago e João, antecipando a glória da ressurreição.' },
      { num: 5, titulo: 'Instituição da Eucaristia',
        meditacao: 'Na Última Ceia, Jesus institui a Eucaristia e o sacerdócio, entregando-se como pão e vinho.' },
    ],
  },
  4: {
    nome: 'Dolorosos', icone: '✝️', cor: 'vermelho',
    lista: [
      { num: 1, titulo: 'Agonia de Jesus no Horto',
        meditacao: 'Jesus ora angustiado no Getsêmani, aceitando a vontade do Pai: "Não a minha, mas a tua vontade."' },
      { num: 2, titulo: 'Flagelação de Jesus na Coluna',
        meditacao: 'Jesus é flagelado cruelmente por nossos pecados, cumprindo a profecia do Servo Sofredor.' },
      { num: 3, titulo: 'Coroação de Espinhos',
        meditacao: 'Os soldados coroam Jesus com espinhos, zombando de sua realeza que é de amor e serviço.' },
      { num: 4, titulo: 'Jesus Carrega a Cruz',
        meditacao: 'Jesus carrega a cruz até o Calvário, encontrando sua Mãe e as mulheres de Jerusalém.' },
      { num: 5, titulo: 'Crucificação e Morte de Jesus',
        meditacao: 'Jesus é crucificado e morre na cruz, entregando ao Pai seu espírito e nos dando Maria como Mãe.' },
    ],
  },
  5: {
    nome: 'Gozosos', icone: '🌟', cor: 'verde',
    lista: [
      { num: 1, titulo: 'Anunciação do Anjo Gabriel a Maria',
        meditacao: 'O Anjo Gabriel anuncia a Maria que ela conceberá o Filho de Deus pelo Espírito Santo.' },
      { num: 2, titulo: 'Visitação de Maria a Isabel',
        meditacao: 'Maria visita Isabel e João Batista tressalta de alegria no seio de sua mãe.' },
      { num: 3, titulo: 'Nascimento de Jesus em Belém',
        meditacao: 'Jesus nasce pobre em Belém, trazendo ao mundo a luz e a paz que anunciam os anjos.' },
      { num: 4, titulo: 'Apresentação de Jesus no Templo',
        meditacao: 'José e Maria oferecem Jesus no Templo; Simeão e Ana reconhecem nele o Salvador.' },
      { num: 5, titulo: 'Encontro de Jesus no Templo',
        meditacao: 'Jesus, aos 12 anos, é encontrado no Templo dialogando com os doutores da Lei.' },
    ],
  },
  6: {
    nome: 'Gloriosos', icone: '✨', cor: 'dourado',
    lista: [
      { num: 1, titulo: 'Ressurreição de Jesus',
        meditacao: 'Jesus ressuscita glorioso dos mortos, vence a morte e nos dá a esperança da vida eterna.' },
      { num: 2, titulo: 'Ascensão de Jesus ao Céu',
        meditacao: 'Jesus sobe aos céus e se senta à direita do Pai, prometendo enviar o Espírito Santo.' },
      { num: 3, titulo: 'Descida do Espírito Santo — Pentecostes',
        meditacao: 'O Espírito Santo desce sobre Maria e os Apóstolos, dando-lhes força para proclamar o Evangelho.' },
      { num: 4, titulo: 'Assunção de Maria ao Céu',
        meditacao: 'Maria é elevada em corpo e alma à glória do Paraíso, como primícias da ressurreição.' },
      { num: 5, titulo: 'Coroação de Maria Rainha do Universo',
        meditacao: 'Maria é coroada Rainha dos céus e da terra, intercedendo por nós junto ao seu Filho.' },
    ],
  },
}

const ORACOES = {
  credoApostolico: {
    titulo: 'Credo Apostólico',
    texto: `Creio em Deus Pai todo-poderoso,
criador do céu e da terra;
e em Jesus Cristo, seu único Filho, nosso Senhor,
que foi concebido pelo poder do Espírito Santo,
nasceu da Virgem Maria,
padeceu sob Pôncio Pilatos,
foi crucificado, morto e sepultado,
desceu à mansão dos mortos,
ressuscitou ao terceiro dia,
subiu aos céus,
está sentado à direita de Deus Pai todo-poderoso,
donde há de vir a julgar os vivos e os mortos.

Creio no Espírito Santo,
na Santa Igreja Católica,
na comunhão dos santos,
na remissão dos pecados,
na ressurreição da carne,
na vida eterna.
Amém.`,
  },
  paiNosso: {
    titulo: 'Pai Nosso',
    texto: `Pai nosso que estais nos céus,
santificado seja o vosso nome;
venha a nós o vosso reino,
seja feita a vossa vontade,
assim na terra como no céu.
O pão nosso de cada dia nos dai hoje;
perdoai-nos as nossas ofensas,
assim como nós perdoamos a quem nos tem ofendido;
e não nos deixeis cair em tentação,
mas livrai-nos do mal.
Amém.`,
  },
  aveMaria: {
    titulo: 'Ave Maria',
    texto: `Ave Maria, cheia de graça,
o Senhor é convosco.
Bendita sois vós entre as mulheres,
e bendito é o fruto do vosso ventre, Jesus.

Santa Maria, Mãe de Deus,
rogai por nós pecadores,
agora e na hora da nossa morte.
Amém.`,
  },
  gloriaAoPai: {
    titulo: 'Glória ao Pai',
    texto: `Glória ao Pai, ao Filho e ao Espírito Santo.
Como era no princípio, agora e sempre.
Por todos os séculos dos séculos.
Amém.`,
  },
  oFatima: {
    titulo: 'Ó meu Jesus (Oração de Fátima)',
    texto: `Ó meu Jesus, perdoai-nos,
livrai-nos do fogo do inferno,
levai as almas todas para o céu,
especialmente as que mais precisarem
da vossa misericórdia.
Amém.`,
  },
  salveRainha: {
    titulo: 'Salve Rainha',
    texto: `Salve Rainha, Mãe de misericórdia,
vida, doçura e esperança nossa, salve!
A vós bradamos os degredados filhos de Eva.
A vós suspiramos, gemendo e chorando
neste vale de lágrimas.
Eia, pois, advogada nossa,
esses vossos olhos misericordiosos a nós volvei.
E depois deste desterro,
mostrai-nos Jesus,
bendito fruto do vosso ventre.
Ó clemente, ó piedosa,
ó doce sempre Virgem Maria.`,
  },
}

// ──────────────────────────────────────────────
// Utilitários
// ──────────────────────────────────────────────

const nl2br = s =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')

// ──────────────────────────────────────────────
// Init
// ──────────────────────────────────────────────

export function initRosarioPage() {
  const root = document.getElementById('rosario-content')
  if (!root) return

  const dia = new Date().getDay()
  const m   = MISTERIOS[dia]

  const diaBadge = document.getElementById('rosario-dia-semana')
  if (diaBadge) diaBadge.textContent = DIAS_SEMANA[dia]

  const badge     = document.getElementById('rosario-misterio-badge')
  const badgeIcon = document.getElementById('rosario-misterio-icone')
  const badgeNome = document.getElementById('rosario-misterio-nome')
  if (badge && badgeIcon && badgeNome) {
    badge.className        = `rosario-misterio-badge misterio-${m.cor}`
    badgeIcon.textContent  = m.icone
    badgeNome.textContent  = `Mistérios ${m.nome}`
  }

  root.innerHTML = renderRosario(m)
}

// ──────────────────────────────────────────────
// Render principal
// ──────────────────────────────────────────────

function renderRosario(m) {
  return `
    ${renderOracoesIniciais()}
    ${renderMisterios(m)}
    ${renderOracoesFinal()}
  `
}

// ──────────────────────────────────────────────
// Orações iniciais
// ──────────────────────────────────────────────

function renderOracoesIniciais() {
  return `
    <section class="rosario-secao" aria-labelledby="label-inicio">
      <div class="rosario-secao-header" id="label-inicio">
        <span class="rosario-secao-num" aria-hidden="true">✦</span>
        <h2 class="rosario-secao-titulo">Orações Iniciais</h2>
      </div>
      <div class="rosario-oracao-lista">
        ${renderOracaoBloco(ORACOES.credoApostolico)}
        ${renderContador('1 Pai Nosso + 3 Ave Marias + 1 Glória', '🙏')}
        ${renderOracaoBloco(ORACOES.paiNosso)}
        ${renderOracaoBloco(ORACOES.aveMaria, 3)}
        ${renderOracaoBloco(ORACOES.gloriaAoPai)}
      </div>
    </section>`
}

// ──────────────────────────────────────────────
// Mistérios
// ──────────────────────────────────────────────

function renderMisterios(m) {
  const misteriosHTML = m.lista.map(mis => `
    <div class="rosario-misterio">
      <div class="rosario-misterio-num-wrap">
        <span class="rosario-misterio-num">${mis.num}º</span>
        <span class="rosario-misterio-linha" aria-hidden="true"></span>
      </div>
      <div class="rosario-misterio-corpo">
        <details class="rosario-detalhe">
          <summary class="rosario-detalhe-header">
            <span class="rosario-detalhe-titulo">${mis.titulo}</span>
            <span class="rosario-detalhe-chevron" aria-hidden="true">
              <i class="fas fa-chevron-down"></i>
            </span>
          </summary>
          <div class="rosario-detalhe-body">
            <p class="rosario-meditacao">${mis.meditacao}</p>
          </div>
        </details>
        <div class="rosario-misterio-oracoes">
          ${renderOracaoMiniaturaInline(ORACOES.paiNosso)}
          ${renderContadorInline('10 ×')}
          ${renderOracaoMiniaturaInline(ORACOES.aveMaria)}
          ${renderOracaoMiniaturaInline(ORACOES.gloriaAoPai)}
          ${renderOracaoMiniaturaInline(ORACOES.oFatima)}
        </div>
      </div>
    </div>`).join('')

  return `
    <section class="rosario-secao rosario-secao-misterios" aria-labelledby="label-misterios">
      <div class="rosario-secao-header" id="label-misterios">
        <span class="rosario-secao-num misterio-${m.cor}" aria-hidden="true">${m.icone}</span>
        <h2 class="rosario-secao-titulo">Mistérios ${m.nome}</h2>
      </div>
      <div class="rosario-misterios-lista">${misteriosHTML}</div>
    </section>`
}

// ──────────────────────────────────────────────
// Orações finais
// ──────────────────────────────────────────────

function renderOracoesFinal() {
  return `
    <section class="rosario-secao" aria-labelledby="label-final">
      <div class="rosario-secao-header" id="label-final">
        <span class="rosario-secao-num" aria-hidden="true">✦</span>
        <h2 class="rosario-secao-titulo">Orações Finais</h2>
      </div>
      <div class="rosario-oracao-lista">
        ${renderOracaoBloco(ORACOES.salveRainha)}
      </div>
    </section>`
}

// ──────────────────────────────────────────────
// Componentes
// ──────────────────────────────────────────────

function renderOracaoBloco(oracao, repeticoes = 1) {
  const repLabel = repeticoes > 1
    ? `<span class="rosario-repeticoes">${repeticoes}×</span>` : ''
  return `
    <details class="rosario-oracao-bloco">
      <summary class="rosario-oracao-header">
        <span class="rosario-oracao-titulo">${oracao.titulo}${repLabel}</span>
        <span class="rosario-oracao-chevron" aria-hidden="true">
          <i class="fas fa-chevron-down"></i>
        </span>
      </summary>
      <div class="rosario-oracao-body">
        <p class="rosario-oracao-texto">${nl2br(oracao.texto)}</p>
      </div>
    </details>`
}

function renderOracaoMiniaturaInline(oracao) {
  return `
    <details class="rosario-miniatura">
      <summary class="rosario-miniatura-header">
        <span>${oracao.titulo}</span>
        <i class="fas fa-chevron-down" aria-hidden="true"></i>
      </summary>
      <div class="rosario-miniatura-body">
        <p class="rosario-oracao-texto">${nl2br(oracao.texto)}</p>
      </div>
    </details>`
}

function renderContador(label, icone = '') {
  return `<p class="rosario-contador">
    ${icone ? `<span aria-hidden="true">${icone}</span>` : ''} ${label}
  </p>`
}

function renderContadorInline(label) {
  return `<span class="rosario-contador-inline">${label}</span>`
}
