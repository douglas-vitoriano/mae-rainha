export function initNavbar() {
  const navbar = document.querySelector('.navbar-principal')

  function atualizarAlturaNavbar() {
    if (!navbar) return
    document.documentElement.style.setProperty(
      '--navbar-height',
      `${navbar.offsetHeight}px`
    )
  }

  atualizarAlturaNavbar()

  requestAnimationFrame(() => {
    atualizarAlturaNavbar()
    setTimeout(atualizarAlturaNavbar, 300)
  })

  window.addEventListener('resize', atualizarAlturaNavbar, { passive: true })

  // ── Burger ──
  document.querySelectorAll('.navbar-burger').forEach(burger => {
    burger.addEventListener('click', () => {
      const target =
        document.getElementById(burger.dataset.target) ||
        burger.closest('.navbar').querySelector('.navbar-menu')

      burger.classList.toggle('is-active')
      burger.setAttribute(
        'aria-expanded',
        burger.classList.contains('is-active') ? 'true' : 'false'
      )
      if (target) target.classList.toggle('is-active')

      setTimeout(atualizarAlturaNavbar, 50)
    })
  })

  if (!navbar) return

  let lastY   = window.scrollY
  let ticking = false

  const update = () => {
    const current = window.scrollY
    const delta   = current - lastY

    navbar.style.boxShadow = current > 40
      ? '0 4px 32px rgba(0,0,0,0.35)'
      : 'none'

    if (current > 80 && delta > 8) {
      navbar.classList.add('navbar-oculta')
      navbar.classList.remove('navbar-visivel')
    }

    if (delta < -6 || current < 80) {
      navbar.classList.remove('navbar-oculta')
      navbar.classList.add('navbar-visivel')
    }

    lastY   = current
    ticking = false
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update)
      ticking = true
    }
  }, { passive: true })

  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('.navbar-item[href^="#"]')

  if (sections.length && navLinks.length) {
    const linkMap = {}
    navLinks.forEach(link => {
      const id = link.getAttribute('href').replace('#', '')
      linkMap[id] = link
    })

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const link = linkMap[entry.target.id]
        if (link) link.classList.toggle('is-active', entry.isIntersecting)
      })
    }, { threshold: 0.4 })

    sections.forEach(s => obs.observe(s))
  }
}
