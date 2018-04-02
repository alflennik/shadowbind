import * as Shadowbind from '../../../src/index.js'

class BindIf extends window.HTMLElement {
  getActual () {
    let tests = []
    this.publish({ showFirst: true, showSecond: false })
    tests.push(this.shadowRoot.querySelector('#first') ? true : false)
    tests.push(this.shadowRoot.querySelector('#second') ? true : false)
    this.publish({ showFirst: false, showSecond: true })
    tests.push(this.shadowRoot.querySelector('#first') ? true : false)
    tests.push(this.shadowRoot.querySelector('#second') ? true : false)
    return tests
  }
  getExpected () {
    return [true, false, false, true]
  }
  template () {
    return /* @html */ `
      <div :if="showFirst" id="first"></div>
      <div :if="showSecond" id="second"></div>
    `
  }
}

Shadowbind.define(BindIf)
