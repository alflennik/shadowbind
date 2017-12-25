import { subscribe, publish } from '../../../src/index.js'

class BindMethodType extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <div :for="myData"></div>`

    this.bind = 'a string'
  }

  getActual () {
    try {
      publish({ myData: [1, 2, 3] })
    } catch (err) {
      return err.code || err
    }
    return 'no errors'
  }

  getExpected () {
    return 'shadowbind_bind_property_type'
  }
}

window.customElements.define('bind-method-type', BindMethodType)
