import { subscribe, publish } from '../../../src/index.js'

class NoShadowRoot extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
  }

  getActual () {
    try {
      publish({})
    } catch (err) {
      return err.code || err
    }
    return 'no errors'
  }

  getExpected () {
    return 'shadowbind_no_shadow_root'
  }
}

window.customElements.define('no-shadow-root', NoShadowRoot)
