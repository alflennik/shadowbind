import { subscribe, publish } from '../../../src/index.js'

class StateKeyNotFoundDeep extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this, 'found.level2.notFound')
    this.attachShadow({ mode: 'open' })
  }

  getActual () {
    try {
      publish({ found: { level2: {} } })
    } catch (err) {
      return err.code || err
    }
  }

  getExpected () {
    return 'shadowbind_subscribe_key_not_found'
  }
}

window.customElements.define('state-key-not-found-deep', StateKeyNotFoundDeep)
