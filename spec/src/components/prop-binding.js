import Shadowbind from '../../../src/index.js'

let result

class BindWithProp extends window.HTMLElement {
  testPropBinding (data) {
    result = data
  }
}

class PropBinding extends window.HTMLElement {
  template () {
    return /* @html */`
      <bind-with-prop prop:test-prop-binding="someData"></bind-with-prop>
    `
  }
  getActual () {
    this.publish({ someData: 'in string form' })
    return result
  }
  getExpected () {
    return 'in string form'
  }
}

Shadowbind.define(PropBinding)
Shadowbind.define(BindWithProp)
