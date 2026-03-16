/* =====================================================
   index.js — Entry point do frontend
   Importa estilos e inicializa todos os módulos JS.

   Estrutura:
     navbar.js     → burger, hide-on-scroll, active links
     animations.js → scroll reveal, contadores animados
     tabs.js       → generic tab switcher
     liturgia.js   → fetch liturgia diária, render, fallback
   ===================================================== */

import "$styles/index.css"
import "$styles/syntax-highlighting.css"

import { initNavbar }       from "./navbar.js"
import { initScrollReveal, initContadores } from "./animations.js"
import { initTabs }         from "./tabs.js"
import { initLiturgiaPage } from "./liturgia.js"
import { initPWA } from "./pwa.js"

document.addEventListener('DOMContentLoaded', () => {
  initNavbar()
  initScrollReveal()
  initContadores()
  initTabs()
  initLiturgiaPage()
  initPWA()
})
