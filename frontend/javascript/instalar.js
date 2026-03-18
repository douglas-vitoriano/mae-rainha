async function loadQRCodeLib() {
  return new Promise((resolve, reject) => {
    if (window.QRCode) return resolve()
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
    script.onload  = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export async function initInstalacaoPage() {
  if (!document.getElementById('instalar-ja-instalado')) return

  const INSTALL_URL = window.location.origin + '/instalar'

  const isIOS = () =>
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  const isAndroid = () => /android/i.test(navigator.userAgent)

  const isMobile = () =>
    isIOS() || isAndroid() || /mobile|tablet/i.test(navigator.userAgent)

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true

  const $jaInstalado = document.getElementById('instalar-ja-instalado')
  const $android     = document.getElementById('instalar-android')
  const $ios         = document.getElementById('instalar-ios')
  const $btnAndroid  = document.getElementById('btn-instalar-android')
  const $qrSection   = document.getElementById('instalar-qr')
  const $qrContainer = document.getElementById('instalar-qr-container')
  const $qrUrl       = document.getElementById('instalar-qr-url')

  let deferredPrompt = null

  function init() {
    if (isStandalone()) {
      $jaInstalado.classList.add('visivel')
      return
    }

    if (isMobile()) {
      if (isIOS()) {
        $ios.classList.add('visivel')
      } else {
        $android.classList.add('visivel')
      }
    } else {
      showQR()
    }
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault()
    deferredPrompt = e

    $ios.classList.remove('visivel')
    $android.classList.add('visivel')
    $btnAndroid.classList.add('visivel')
  })

  $btnAndroid?.addEventListener('click', async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log('[PWA] Resultado:', outcome)
    deferredPrompt = null
    $btnAndroid.classList.remove('visivel')

    if (outcome === 'accepted') {
      $android.classList.remove('visivel')
      $jaInstalado.classList.add('visivel')
    }
  })

  window.addEventListener('appinstalled', () => {
    $android.classList.remove('visivel')
    $ios.classList.remove('visivel')
    $jaInstalado.classList.add('visivel')
    console.log('[PWA] App instalado')
  })

  async function showQR() {
    $qrSection.classList.add('visivel')
    $qrUrl.textContent = INSTALL_URL

    try {
      await loadQRCodeLib()
      new QRCode($qrContainer, {
        text: INSTALL_URL,
        width: 190,
        height: 190,
        colorDark: '#0b1530',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    } catch (e) {
      console.warn('[PWA] Falha ao carregar lib QRCode:', e)
      $qrContainer.textContent = INSTALL_URL
    }
  }

  init()
}
