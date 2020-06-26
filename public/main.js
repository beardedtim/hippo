import { esRequire } from '/assets/js/esRequire.js'

const main = async () => {
  const App = await esRequire('/assets/components/App/component.js')
  const Header = await esRequire('/assets/components/Header/component.js')

  customElements.define('t-header', Header)
  customElements.define('t-app', App)
}

window.addEventListener('load', main)