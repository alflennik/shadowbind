import { subscribe, publish } from '../../../src/index.js'

let result

class BindWithProp extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.notFunction = 'a string'
  }
  testPropBinding (data) {
    result = data
  }
}

class PropBinding extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <bind-with-prop prop:test-prop-binding="someData"></bind-with-prop>`
  }
  connectedCallback () {
    subscribe(this)
  }
  getActual () {
    publish({ someData: 'in string form' })
    return result
  }
  getExpected () {
    return 'in string form'
  }
}

window.customElements.define('prop-binding', PropBinding)
window.customElements.define('bind-with-prop', BindWithProp)
