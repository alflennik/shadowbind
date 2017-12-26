import { subscribe, publish } from '../../../src/index.js'

class InvalidBind extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <span></span>`

    this.bind = 'a string'
  }
}

class RepeaterBindType extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <invalid-bind :for="myData"></invalid-bind>`
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

window.customElements.define('repeater-bind-type', RepeaterBindType)
window.customElements.define('invalid-bind', InvalidBind)
