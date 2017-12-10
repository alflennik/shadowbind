import { subscribe, publish } from '../../../dist/shadowbind.js'

class StateKeyType extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this, ['firstKey', 'secondKey'])
    this.attachShadow({ mode: 'open' })
  }

  getActual () {
    try {
      publish({})
    } catch (err) {
      return err.code || err
    }
  }

  getExpected () {
    return 'shadowbind_subscribe_key_type'
  }
}

window.customElements.define('state-key-type', StateKeyType)
