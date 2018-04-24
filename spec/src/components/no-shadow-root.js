import Shadowbind from '../../../src/index.js'

class NoShadowRoot extends Shadowbind.Element {
  getActual () {
    try {
      Shadowbind.define({ NoShadowRootExample })
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_no_shadow_root'
  }
  template () {
    return /* @html */`
      <no-shadow-root-example></no-shadow-root-example>
    `
  }
}

class NoShadowRootExample extends Shadowbind.Element {
  constructor () {
    super()
    this.data({})
  }
}

Shadowbind.define({ NoShadowRoot })
