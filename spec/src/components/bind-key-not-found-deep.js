import Shadowbind from '../../../src/index.js'

class BindKeyNotFoundDeep extends Shadowbind.Element {
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
      this.data({ level1: { level2: {} } })
    } catch (err) {
      return err.code || err.message
    }
  }
}

Shadowbind.define(BindKeyNotFoundDeep)
