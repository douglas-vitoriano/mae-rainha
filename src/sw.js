/* =====================================================
   sw.js — Service Worker PWA
   Grupo de Oração Mãe Rainha
   
   Estratégias:
     - Shell (HTML/CSS/JS): Network-first → Cache → Offline
     - Assets estáticos:    Cache-first → Network
     - API liturgia:        Network-first → {} vazio (fallback JS trata)
     - Fontes/CDN:          Cache-first (stale-while-revalidate)
   ===================================================== */

const APP_VERSION    = 'v2'
const CACHE_SHELL    = `mae-rainha-shell-${APP_VERSION}`
const CACHE_STATIC   = `mae-rainha-static-${APP_VERSION}`
const CACHE_FONTS    = `mae-rainha-fonts-${APP_VERSION}`
const ALL_CACHES     = [CACHE_SHELL, CACHE_STATIC, CACHE_FONTS]

// Recursos críticos pré-cacheados no install
const PRE_CACHE = [
  '/',
  '/liturgia',
  '/offline.html',
  '/404.html',
  '/manifest.json',
  '/images/logotipo.png',
  '/images/icons/icon-192.png',
  '/images/icons/icon-512.png',
]

// ── Install: pré-cacheia o shell da aplicação ──────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_SHELL)
      .then(cache => cache.addAll(PRE_CACHE))
      .then(() => {
        console.log('[SW] Shell cacheado com sucesso')
        return self.skipWaiting()
      })
      .catch(err => console.warn('[SW] Erro no pre-cache:', err))
  )
})

// ── Activate: limpa caches antigos e assume controle ──────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => !ALL_CACHES.includes(k))
          .map(k => {
            console.log('[SW] Removendo cache antigo:', k)
            return caches.delete(k)
          })
      ))
      .then(() => self.clients.claim())
  )
})

// ── Fetch: roteamento por tipo de recurso ─────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Ignora métodos não-GET
  if (request.method !== 'GET') return

  // Ignora extensões do browser e requests de devtools
  if (url.protocol === 'chrome-extension:') return

  // ── API Liturgia: Network-first, sem cache (dados mudam todo dia) ──
  if (url.hostname.includes('liturgia.up.railway.app')) {
    event.respondWith(networkOnlyWithFallback(request))
    return
  }

  // ── Cross-origin desconhecido: não intercepta ──
  if (url.origin !== self.location.origin) {
    // Exceto fontes do Google: Cache-first
    if (url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com')) {
      event.respondWith(cacheFirstWithNetwork(request, CACHE_FONTS))
      return
    }
    // CDN conhecidos (Bulma, Font Awesome): Cache-first
    if (url.hostname.includes('cdn.jsdelivr.net') ||
        url.hostname.includes('cdnjs.cloudflare.com')) {
      event.respondWith(cacheFirstWithNetwork(request, CACHE_STATIC))
      return
    }
    return
  }

  // ── Assets buildados pelo esbuild: Cache-first ──
  if (url.pathname.startsWith('/_bridgetown/static/')) {
    event.respondWith(cacheFirstWithNetwork(request, CACHE_STATIC))
    return
  }

  // ── Imagens e fontes locais: Cache-first ──
  if (
    url.pathname.startsWith('/images/') ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/) ||
    url.pathname.match(/\.(woff2?|ttf|eot)$/)
  ) {
    event.respondWith(cacheFirstWithNetwork(request, CACHE_STATIC))
    return
  }

  // ── manifest.json e sw.js: Network-first (precisam estar atualizados) ──
  if (url.pathname === '/manifest.json' || url.pathname === '/sw.js') {
    event.respondWith(networkFirstWithCache(request, CACHE_SHELL))
    return
  }

  // ── Páginas HTML: Network-first → Cache → Offline ──
  event.respondWith(networkFirstWithOfflineFallback(request))
})

// ── Estratégias ───────────────────────────────────────────────────────

/** Network-only com fallback JSON vazio (API) */
async function networkOnlyWithFallback(request) {
  try {
    return await fetch(request)
  } catch {
    return new Response('{}', {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

/** Cache-first → Network → salva no cache */
async function cacheFirstWithNetwork(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response('Not found', { status: 404 })
  }
}

/** Network-first → Cache */
async function networkFirstWithCache(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    return cached || new Response('Offline', { status: 503 })
  }
}

/** Network-first → Cache → /offline.html (para páginas HTML) */
async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_SHELL)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached

    // Se for navegação, retorna página offline
    if (request.mode === 'navigate') {
      return caches.match('/offline.html')
    }

    return new Response('Offline', { status: 503 })
  }
}

// ── Mensagens do cliente ──────────────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data?.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: APP_VERSION })
  }
})