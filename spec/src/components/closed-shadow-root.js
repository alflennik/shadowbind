import Shadowbind from '../../../src/index.js'

class ClosedShadowRoot extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'closed' })
  }
  getActual () {
    try {
      this.publish({})
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_closed_shadow_root'
  }
}

Shadowbind.define(ClosedShadowRoot)
