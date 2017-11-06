import { subscribe, publish } from '../../../src/shadowbind.js'

class ClosedShadowRoot extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'closed' })
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
    return 'shadowbind_closed_shadow_root'
  }
}

window.customElements.define('closed-shadow-root', ClosedShadowRoot)
