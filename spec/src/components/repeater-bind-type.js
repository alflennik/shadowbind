import Shadowbind from '../../../src/index.js'

class InvalidBind extends Shadowbind.Element {
  constructor () {
    super()
    this.bindings = 'a string'
  }
  template () {
    return /* @html */`<span></span>`
  }
}

class RepeaterBindType extends Shadowbind.Element {
  template () {
    return /* @html */`<invalid-bind :map="myData"></invalid-bind>`
  }
  getActual () {
    try {
      this.data({ myData: [1, 2, 3] })
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_bindings_property_type'
  }
}

Shadowbind.define(RepeaterBindType)
Shadowbind.define(InvalidBind)
