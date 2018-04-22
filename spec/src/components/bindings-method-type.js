import Shadowbind from '../../../src/index.js'

class BindingsMethodType extends Shadowbind.Element {
  constructor () {
    super()
    this.bindings = 'a string'
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
  template () {
    return ''
  }
}

Shadowbind.define({ BindingsMethodType })
