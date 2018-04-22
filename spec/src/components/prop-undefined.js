import Shadowbind from '../../../src/index.js'

class PropUndefined extends Shadowbind.Element {
  template () {
    return /* @html */`<div prop:anything="someData"></div>`
  }
  getActual () {
    try {
      this.data({ someData: {} })
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_prop_undefined'
  }
}

Shadowbind.define({ PropUndefined })
