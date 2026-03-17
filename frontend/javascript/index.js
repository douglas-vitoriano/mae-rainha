import "$styles/index.css"
import "$styles/syntax-highlighting.css"

import { initNavbar }                      from "./navbar.js"
import { initScrollReveal, initContadores } from "./animations.js"
import { initTabs }                        from "./tabs.js"
import { initLiturgiaPage }                from "./liturgia.js"
import { initRosarioPage }                 from "./rosario.js"
import { initPWA }                         from "./pwa.js"

document.addEventListener('DOMContentLoaded', () => {
  initNavbar()
  initScrollReveal()
  initContadores()
  initTabs()

  if (document.getElementById('liturgia-content')) initLiturgiaPage()
  if (document.getElementById('rosario-content'))  initRosarioPage()

  initPWA()
})