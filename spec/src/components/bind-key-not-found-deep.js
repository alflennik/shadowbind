import Shadowbind from '../../../src/index.js'

class BindKeyNotFoundDeep extends Shadowbind.Element {
  getActual () {
    this.data({ level1: { level2: {} } })
    return 'cool, no errors'
  }
  getExpected () {
    return 'cool, no errors'
  }
  template () {
    return /* @html */`
      <div :text='level1.level2.level3'></div>
    `
  }
}

Shadowbind.define({ BindKeyNotFoundDeep })
