const APP_VERSION  = '1.2'

const CACHE_SHELL  = `mae-rainha-shell-${APP_VERSION}`
const CACHE_STATIC = `mae-rainha-static-${APP_VERSION}`
const CACHE_FONTS  = `mae-rainha-fonts-${APP_VERSION}`
const ALL_CACHES   = [CACHE_SHELL, CACHE_STATIC, CACHE_FONTS]

const PRE_CACHE = [
  '/',
  '/index.html',
  '/liturgia',
  '/liturgia/',
  '/rosario',
  '/rosario/',
  '/biblia',
  '/biblia/',
  '/instalar',
  '/instalar/',
  '/offline.html',
  '/404.html',
  '/500.html',
  '/manifest.json',
  '/biblia_ave_maria.json',
  '/images/logotipo.png',
  '/images/sagradafamilia.png',
  '/images/icons/icon-72.png',
  '/images/icons/icon-96.png',
  '/images/icons/icon-128.png',
  '/images/icons/icon-144.png',
  '/images/icons/icon-152.png',
  '/images/icons/icon-192.png',
  '/images/icons/icon-384.png',
  '/images/icons/icon-512.png',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_SHELL)
      .then(cache =>
        Promise.allSettled(
          PRE_CACHE.map(url =>
            cache.add(url).catch(err =>
              console.warn('[SW] Não foi possível pré-cachear:', url, err)
            )
          )
        )
      )
      .then(() => {
        console.log(`[SW] v${APP_VERSION} instalado`)
      })
      .catch(err => console.warn('[SW] Erro no pre-cache:', err))
  )
})

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
      .then(() => {
        console.log(`[SW] v${APP_VERSION} ativo`)
        return self.clients.claim()
      })
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return
  if (url.protocol === 'chrome-extension:') return

  if (url.hostname.includes('liturgia.up.railway.app')) {
    event.respondWith(networkOnlyWithFallback(request))
    return
  }

  if (url.origin !== self.location.origin) {
    if (url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com')) {
      event.respondWith(cacheFirstWithNetwork(request, CACHE_FONTS))
      return
    }
    if (url.hostname.includes('cdn.jsdelivr.net') ||
        url.hostname.includes('cdnjs.cloudflare.com')) {
      event.respondWith(cacheFirstWithNetwork(request, CACHE_STATIC))
      return
    }
    return
  }

  if (url.pathname.startsWith('/_bridgetown/static/')) {
    event.respondWith(cacheFirstWithNetwork(request, CACHE_STATIC))
    return
  }

  if (
    url.pathname.startsWith('/images/') ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|svg|ico)$/) ||
    url.pathname.match(/\.(woff2?|ttf|eot)$/)
  ) {
    event.respondWith(cacheFirstWithNetwork(request, CACHE_STATIC))
    return
  }

  if (url.pathname === '/biblia_ave_maria.json') {
    event.respondWith(cacheFirstWithNetwork(request, CACHE_STATIC))
    return
  }

  if (url.pathname === '/manifest.json' || url.pathname === '/sw.js') {
    event.respondWith(networkFirstWithCache(request, CACHE_SHELL))
    return
  }

  event.respondWith(networkFirstWithOfflineFallback(request))
})


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

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_SHELL)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    let cached = await caches.match(request)
    if (cached) return cached

    const url = new URL(request.url)
    const variantes = new Set()

    if (url.pathname.endsWith('/')) {
      variantes.add(url.pathname.slice(0, -1))
      variantes.add(url.pathname + 'index.html')
    } else {
      variantes.add(url.pathname + '/')
      variantes.add(url.pathname + '/index.html')
      variantes.add(url.pathname + '.html')
    }

    for (const alt of variantes) {
      cached = await caches.match(new Request(url.origin + alt))
      if (cached) return cached
    }

    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html')
      if (offlinePage) return offlinePage
    }

    return new Response('Offline', { status: 503 })
  }
}

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') {
    console.log('[SW] SKIP_WAITING recebido — ativando nova versão')
    self.skipWaiting()
  }

  if (event.data?.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: APP_VERSION })
  }
})
