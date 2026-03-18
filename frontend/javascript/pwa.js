export function initPWA() {
  registerServiceWorker()
  handleInstallPrompt()
}

const VERSAO_KEY = 'pwa-app-version'

function isPaginaInstalacao() {
  return window.location.pathname.startsWith('/instalar')
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
}

let pendingUpdateWorker = null

function syncFooterPwaBtn(estado, worker = null) {
  const btn   = document.getElementById('footer-pwa-btn')
  const icon  = document.getElementById('footer-pwa-icon')
  const label = document.getElementById('footer-pwa-label')
  if (!btn || !icon || !label) return

  btn.classList.remove('tem-update', 'oculto')

  switch (estado) {
    case 'atualizar':
      pendingUpdateWorker = worker
      icon.className    = 'fas fa-rotate-right'
      label.textContent = 'Atualizar o app'
      btn.classList.add('tem-update')
      btn.setAttribute('href', '#')
      btn.onclick = e => {
        e.preventDefault()
        if (pendingUpdateWorker) pendingUpdateWorker.postMessage({ type: 'SKIP_WAITING' })
      }
      break

    case 'oculto':
      btn.classList.add('oculto')
      break

    case 'instalar':
    default:
      icon.className    = 'fas fa-mobile-alt'
      label.textContent = 'Instalar o app'
      btn.setAttribute('href', '/instalar')
      btn.onclick = null
      break
  }
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
      console.log('[PWA] Service Worker registrado:', reg.scope)

      setInterval(() => reg.update(), 30 * 60 * 1000)

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', async () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            const versaoNova  = await getVersionFromWorker(newWorker)
            const versaoAtual = localStorage.getItem(VERSAO_KEY)

            console.log(`[PWA] Versão instalada: ${versaoAtual} → nova: ${versaoNova}`)

            if (versaoNova && versaoNova !== versaoAtual) {
              syncFooterPwaBtn('atualizar', newWorker)
              showUpdateBanner(newWorker, versaoNova)
            }
          }
        })
      })

      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', async () => {
        if (refreshing) return
        refreshing = true
        const versao = await getVersionFromWorker(navigator.serviceWorker.controller)
        if (versao) localStorage.setItem(VERSAO_KEY, versao)
        window.location.reload()
      })

      if (navigator.serviceWorker.controller) {
        const versao = await getVersionFromWorker(navigator.serviceWorker.controller)
        if (versao && !localStorage.getItem(VERSAO_KEY)) {
          localStorage.setItem(VERSAO_KEY, versao)
        }
      }

      if (isInStandaloneMode()) syncFooterPwaBtn('oculto')

    } catch (err) {
      console.warn('[PWA] Falha ao registrar SW:', err)
    }
  })
}

function getVersionFromWorker(worker) {
  return new Promise(resolve => {
    if (!worker) return resolve(null)
    const channel = new MessageChannel()
    const timer = setTimeout(() => resolve(null), 3000)
    channel.port1.onmessage = event => {
      clearTimeout(timer)
      resolve(event.data?.version ?? null)
    }
    try {
      worker.postMessage({ type: 'GET_VERSION' }, [channel.port2])
    } catch {
      clearTimeout(timer)
      resolve(null)
    }
  })
}

let deferredPrompt = null

function handleInstallPrompt() {
  const pagInstalar = isPaginaInstalacao()

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault()
    deferredPrompt = event

    if (pagInstalar) { showInstallBanner(deferredPrompt); return }
    if (sessionStorage.getItem('pwa-banner-dismissed')) return
    setTimeout(() => showInstallBanner(deferredPrompt), 3000)
  })

  window.addEventListener('appinstalled', () => {
    hideInstallBanner()
    deferredPrompt = null
    syncFooterPwaBtn('oculto')
    console.log('[PWA] Aplicativo instalado com sucesso')
  })

  if (isIOS() && !isInStandaloneMode()) {
    if (pagInstalar) {
      setTimeout(() => showIOSHint(), 500)
    } else if (!sessionStorage.getItem('pwa-ios-hint-dismissed')) {
      setTimeout(() => showIOSHint(), 4000)
    }
  }
}

function showInstallBanner(prompt) {
  if (document.getElementById('pwa-install-banner')) return
  const banner = document.createElement('div')
  banner.id = 'pwa-install-banner'
  banner.className = 'pwa-banner'
  banner.setAttribute('role', 'complementary')
  banner.setAttribute('aria-label', 'Instalar aplicativo')
  banner.innerHTML = `
    <div class="pwa-banner-inner">
      <img src="/images/icons/icon-72.png" alt="" class="pwa-banner-icon" width="40" height="40" loading="lazy">
      <div class="pwa-banner-texto">
        <strong>Adicionar à tela inicial</strong>
        <span>Liturgia, Rosário e orações — acesso offline</span>
      </div>
      <div class="pwa-banner-actions">
        <button class="pwa-btn pwa-btn-primario" id="pwa-install-btn">Instalar</button>
        <button class="pwa-btn pwa-btn-fechar" id="pwa-dismiss-btn" aria-label="Fechar banner">✕</button>
      </div>
    </div>
  `
  document.body.appendChild(banner)

  document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
    hideInstallBanner()
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    deferredPrompt = null
    if (outcome === 'dismissed' && !isPaginaInstalacao()) {
      sessionStorage.setItem('pwa-banner-dismissed', '1')
    }
  })

  document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
    hideInstallBanner()
    if (!isPaginaInstalacao()) sessionStorage.setItem('pwa-banner-dismissed', '1')
  })
}

function hideInstallBanner() {
  document.getElementById('pwa-install-banner')?.remove()
}

function showIOSHint() {
  if (document.getElementById('pwa-ios-hint')) return
  const hint = document.createElement('div')
  hint.id = 'pwa-ios-hint'
  hint.className = 'pwa-banner pwa-banner--ios'
  hint.setAttribute('role', 'complementary')
  hint.setAttribute('aria-label', 'Instalar no iPhone')
  hint.innerHTML = `
    <div class="pwa-banner-inner">
      <img src="/images/icons/icon-72.png" alt="" class="pwa-banner-icon" width="40" height="40" loading="lazy">
      <div class="pwa-banner-texto">
        <strong>Adicionar ao iPhone</strong>
        <span>Toque em <strong style="color:white">Compartilhar</strong> <span aria-label="ícone compartilhar">⬆️</span> e depois <strong style="color:white">"Tela de Início"</strong></span>
      </div>
      <button class="pwa-btn pwa-btn-fechar" id="pwa-ios-dismiss-btn" aria-label="Fechar">✕</button>
    </div>
  `
  document.body.appendChild(hint)
  document.getElementById('pwa-ios-dismiss-btn')?.addEventListener('click', () => {
    hint.remove()
    if (!isPaginaInstalacao()) sessionStorage.setItem('pwa-ios-hint-dismissed', '1')
  })
}

function showUpdateBanner(newWorker, versaoNova) {
  if (document.getElementById('pwa-update-banner')) return
  const banner = document.createElement('div')
  banner.id = 'pwa-update-banner'
  banner.className = 'pwa-banner pwa-banner--update'
  banner.setAttribute('role', 'alert')
  banner.setAttribute('aria-live', 'polite')
  banner.innerHTML = `
    <div class="pwa-banner-inner">
      <span class="pwa-banner-icon" aria-hidden="true" style="font-size:1.4rem">✦</span>
      <div class="pwa-banner-texto">
        <strong>Nova versão disponível</strong>
        <span>Versão ${versaoNova} — toque para atualizar agora</span>
      </div>
      <div class="pwa-banner-actions">
        <button class="pwa-btn pwa-btn-primario" id="pwa-update-btn">Atualizar</button>
        <button class="pwa-btn pwa-btn-fechar" id="pwa-update-dismiss-btn" aria-label="Fechar">✕</button>
      </div>
    </div>
  `
  document.body.appendChild(banner)

  document.getElementById('pwa-update-btn')?.addEventListener('click', () => {
    banner.remove()
    syncFooterPwaBtn('oculto')
    newWorker.postMessage({ type: 'SKIP_WAITING' })
  })

  document.getElementById('pwa-update-dismiss-btn')?.addEventListener('click', () => {
    banner.remove()
  })
}
