import Shadowbind from '../../../src/index.js'

class BindKeyNotFound extends window.HTMLElement {
  template () {
    return /* @html */`<div :text='undefKey'></div>`
  }
  async getExpected () {
    return 'shadowbind_key_not_found'
  }
  async getActual () {
    try {
      this.data({})
    } catch (err) {
      return err.code || err.message
    }
  }
}

Shadowbind.define(BindKeyNotFound)
