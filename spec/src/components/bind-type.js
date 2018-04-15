import Shadowbind from '../../../src/index.js'

class BindType extends window.HTMLElement {
  template () {
    return ''
  }
  bind (state) {
    return 'this is a string'
  }
  async getExpected () {
    return 'shadowbind_bind_method_return_type'
  }
  async getActual () {
    try {
      this.publish({})
    } catch (err) {
      return err.code || err.message
    }
  }
}

define(BindType)
