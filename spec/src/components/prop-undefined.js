import define from '../../../src/index.js'

class PropUndefined extends window.HTMLElement {
  template () {
    return /* @html */`<div prop:anything="someData"></div>`
  }
  getActual () {
    try {
      this.publish({ someData: {} })
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_prop_undefined'
  }
}

define(PropUndefined)
