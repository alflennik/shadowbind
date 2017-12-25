import { subscribe, publish } from '../../../src/index.js'

class PropUndefined extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <div prop:anything="someData"></div>`
  }
  connectedCallback () {
    subscribe(this)
  }
  getActual () {
    try {
      publish({ someData: {} })
    } catch (err) {
      return err.code || err
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_prop_undefined'
  }
}

window.customElements.define('prop-undefined', PropUndefined)
