/* =====================================================
   pwa.js — Gerenciamento do PWA
   - Registro do Service Worker com controle de update
   - Banner de instalação (beforeinstallprompt)
   - Banner de atualização (nova versão disponível)
   - Detecção iOS (sem beforeinstallprompt nativo)
   - Respeita sessão: não mostra banner se já dispensado
   ===================================================== */

export function initPWA() {
  registerServiceWorker()
  handleInstallPrompt()
}

// ── Service Worker ────────────────────────────────────────────────────

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  // Aguarda o load completo para não competir com recursos críticos
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
      console.log('[PWA] Service Worker registrado:', reg.scope)

      // Checa atualizações a cada 30 minutos (bom para apps abertos o dia inteiro)
      setInterval(() => reg.update(), 30 * 60 * 1000)

      // Detecta novo worker sendo instalado
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          // Novo SW instalado E já existe um SW ativo (não é primeira instalação)
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner(newWorker)
          }
        })
      })

      // Detecta quando o SW assume controle (após atualização via SKIP_WAITING)
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true
          window.location.reload()
        }
      })

    } catch (err) {
      console.warn('[PWA] Falha ao registrar SW:', err)
    }
  })
}

// ── Banner de Instalação ──────────────────────────────────────────────

let deferredPrompt = null

function handleInstallPrompt() {
  // Android / Chrome / Edge: evento nativo
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault()
    deferredPrompt = event

    // Não mostra se já foi dispensado nesta sessão
    if (sessionStorage.getItem('pwa-banner-dismissed')) return

    // Pequeno delay para não aparecer logo no primeiro acesso
    setTimeout(() => showInstallBanner(deferredPrompt), 3000)
  })

  window.addEventListener('appinstalled', () => {
    hideInstallBanner()
    deferredPrompt = null
    console.log('[PWA] Aplicativo instalado com sucesso')
  })

  // iOS: não tem beforeinstallprompt — detectamos manualmente
  if (isIOS() && !isInStandaloneMode()) {
    if (!sessionStorage.getItem('pwa-ios-hint-dismissed')) {
      setTimeout(() => showIOSHint(), 4000)
    }
  }
}

// ── Helpers de detecção ───────────────────────────────────────────────

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
}

// ── Banners ───────────────────────────────────────────────────────────

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
        <span>Liturgia diária e acesso offline</span>
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
    console.log('[PWA] Resultado da instalação:', outcome)
    if (outcome === 'dismissed') {
      sessionStorage.setItem('pwa-banner-dismissed', '1')
    }
  })

  document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
    hideInstallBanner()
    sessionStorage.setItem('pwa-banner-dismissed', '1')
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
    sessionStorage.setItem('pwa-ios-hint-dismissed', '1')
  })
}

function showUpdateBanner(newWorker) {
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
        <strong>Atualização disponível</strong>
        <span>Nova versão pronta para usar</span>
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
    // Manda mensagem pro novo SW para ativar imediatamente
    newWorker.postMessage({ type: 'SKIP_WAITING' })
  })

  document.getElementById('pwa-update-dismiss-btn')?.addEventListener('click', () => {
    banner.remove()
  })
}