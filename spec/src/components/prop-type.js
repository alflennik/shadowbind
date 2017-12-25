import { subscribe, publish } from '../../../src/index.js'

class WrongPropType extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.notFunction = 'a string'
  }
}

class PropType extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <wrong-prop-type prop:not-function="someData"></wrong-prop-type>`
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
    return 'shadowbind_prop_type'
  }
}

window.customElements.define('prop-type', PropType)
window.customElements.define('wrong-prop-type', WrongPropType)
