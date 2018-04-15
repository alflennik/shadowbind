import Shadowbind from '../../../src/index.js'

class BindArray extends window.HTMLElement {
  template () {
    return /* @html */`
      <div :text='getArray'></div>
    `
  }
  async getExpected () {
    return 'shadowbind_binding_array_or_object'
  }
  async getActual () {
    try {
      this.publish({ getArray: [1, 2, 3] })
    } catch (err) {
      return err.code || err.message
    }
  }
}

define(BindArray)
