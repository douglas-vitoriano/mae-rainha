/**
 * Ativa tabs dentro de um container.
 * @param {Element|Document} root — escopo de busca (document ou #liturgia-content)
 */
export function initTabs(root = document) {
  const tabs = root.querySelectorAll('.liturgia-tab')
  if (!tabs.length) return

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      root.querySelectorAll('.liturgia-tab').forEach(t => {
        t.classList.remove('ativo')
        t.setAttribute('aria-selected', 'false')
      })
      root.querySelectorAll('.liturgia-panel').forEach(p => p.classList.remove('ativo'))

      tab.classList.add('ativo')
      tab.setAttribute('aria-selected', 'true')

      const target = root.querySelector(`#${tab.dataset.panel}`) ||
                     document.getElementById(tab.dataset.panel)
      if (target) target.classList.add('ativo')
    })
  })
}