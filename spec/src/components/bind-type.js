import { subscribe, publish } from '../../../src/index.js'

class BindType extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
  }

  async getExpected () {
    return 'shadowbind_bind_method_return_type'
  }

  async getActual () {
    try {
      publish({})
    } catch (err) {
      return err.code || err
    }
  }

  bind (state) {
    return 'this is a string'
  }
}

window.customElements.define('bind-type', BindType)
