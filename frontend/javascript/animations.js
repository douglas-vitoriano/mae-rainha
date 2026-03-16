export function initScrollReveal() {
  const els = document.querySelectorAll('.reveal')
  if (!els.length) return

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visivel')
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })

  els.forEach(el => obs.observe(el))
}

export function initContadores() {
  const els = document.querySelectorAll('[data-contador]')
  if (!els.length) return

  const animar = el => {
    const alvo    = parseInt(el.dataset.contador, 10)
    const sufixo  = el.dataset.sufixo || ''
    const duracao = 1800
    const inicio  = performance.now()

    const tick = agora => {
      const p      = Math.min((agora - inicio) / duracao, 1)
      const easeOut = 1 - Math.pow(1 - p, 3)
      el.textContent = Math.round(easeOut * alvo) + sufixo
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animar(entry.target)
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })

  els.forEach(el => obs.observe(el))
}