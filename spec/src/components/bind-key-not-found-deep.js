import define from '../../../src/index.js'

class BindKeyNotFoundDeep extends window.HTMLElement {
  template () {
    return /* @html */`
      <div :text='level1.level2.level3'></div>
    `
  }
  async getExpected () {
    return 'shadowbind_key_not_found'
  }
  async getActual () {
    try {
      this.publish({ level1: { level2: {} } })
    } catch (err) {
      return err.code || err.message
    }
  }
}

define(BindKeyNotFoundDeep)
