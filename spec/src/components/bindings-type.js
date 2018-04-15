import Shadowbind from '../../../src/index.js'

class BindingsType extends window.HTMLElement {
  template () {
    return ''
  }
  bindings (state) {
    return 'this is a string'
  }
  async getExpected () {
    return 'shadowbind_bindings_method_return_type'
  }
  async getActual () {
    try {
      this.publish({})
    } catch (err) {
      return err.code || err.message
    }
  }
}

Shadowbind.define(BindingsType)
