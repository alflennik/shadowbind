import Shadowbind from '../../../src/index.js'

let result

class BindWithProp extends window.HTMLElement {
  testPropBinding (data) {
    result = data
  }
}

class PropBinding extends Shadowbind.Element {
  getActual () {
    this.data({ someData: 'in string form' })
    return result
  }
  getExpected () {
    return 'in string form'
  }
  template () {
    return /* @html */`
      <bind-with-prop prop:test-prop-binding="someData"></bind-with-prop>
    `
  }
}

window.customElements.define('bind-with-prop', BindWithProp)
Shadowbind.define({ PropBinding })
