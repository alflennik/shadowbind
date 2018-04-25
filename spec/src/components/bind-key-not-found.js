import Shadowbind from '../../../src/index.js'

class BindKeyNotFound extends Shadowbind.Element {
  getActual () {
    this.data({})
    return 'cool, no errors'
  }
  getExpected () {
    return 'cool, no errors'
  }
  template () {
    return /* @html */`
      <div :text='undefKey'></div>
    `
  }
}

Shadowbind.define({ BindKeyNotFound })
