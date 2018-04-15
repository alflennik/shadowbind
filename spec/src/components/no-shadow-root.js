import Shadowbind from '../../../src/index.js'

class NoShadowRoot extends window.HTMLElement {
  getActual () {
    try {
      this.publish({})
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_no_shadow_root'
  }
}

define(NoShadowRoot)
