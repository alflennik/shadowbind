import Shadowbind from '../../../src/index.js'

class ClosedShadowRoot extends Shadowbind.Element {
  constructor () {
    super()
    this.attachShadow({ mode: 'closed' })
  }
  getActual () {
    try {
      this.data({})
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_closed_shadow_root'
  }
}

Shadowbind.define({ ClosedShadowRoot })
