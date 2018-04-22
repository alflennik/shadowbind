import Shadowbind from '../../../src/index.js'

class BindNested extends Shadowbind.Element {
  template () {
    return /* @html */`
      <h2 :text="outer" id="outer"></h2>
      <nested-element id="nested-element"></nested-element>
    `
  }
  subscribe () {
    return { outer: 'state' }
  }
  async getExpected () {
    return { outer: 'test', inner: 'test2' }
  }
  async getActual () {
    Shadowbind.publish({ outer: 'test', inner: 'test2' })
    return {
      outer: this.shadowRoot.querySelector('#outer').innerText,
      inner: this.shadowRoot
        .querySelector('#nested-element')
        .shadowRoot
        .querySelector('#inner')
        .innerText
    }
  }
}

class NestedElement extends Shadowbind.Element {
  template () {
    return /* @html */`<h2 :text="inner" id="inner"></h2>`
  }
  subscribe () {
    return { inner: 'state' }
  }
}

Shadowbind.define({ BindNested })
Shadowbind.define({ NestedElement })
