import { define } from '../../../src/index.js'

class BindMethodType extends window.HTMLElement {
  constructor () {
    super()
    this.bind = 'a string'
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
    return 'shadowbind_bind_property_type'
  }
}

define(BindMethodType)
