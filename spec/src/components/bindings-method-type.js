import Shadowbind from '../../../src/index.js'

class BindingsMethodType extends window.HTMLElement {
  constructor () {
    super()
    this.bindings = 'a string'
  }
  template () {
    return /* @html */`<div :publish="myData"></div>`
  }
  getActual () {
    try {
      this.publish({ myData: [1, 2, 3] })
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_bindings_property_type'
  }
}

Shadowbind.define(BindingsMethodType)
