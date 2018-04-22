import Shadowbind from '../../../src/index.js'

class NoShadowRoot extends Shadowbind.Element {
  getActual () {
    try {
      this.data({})
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_no_shadow_root'
  }
}

Shadowbind.define({ NoShadowRoot })
