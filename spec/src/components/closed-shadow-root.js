import define from '../../../src/index.js'

class ClosedShadowRoot extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'closed' })
  }
  getActual () {
    try {
      this.publish({})
    } catch (err) {
      return err.code || err
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_closed_shadow_root'
  }
}

define(ClosedShadowRoot)
