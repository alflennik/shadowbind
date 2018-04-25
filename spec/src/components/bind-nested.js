import Shadowbind from '../../../src/index.js'

class BindNested extends Shadowbind.Element {
  subscribe () {
    return { outer: 'state' }
  }
  getActual () {
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
  getExpected () {
    return { outer: 'test', inner: 'test2' }
  }
  template () {
    return /* @html */`
      <h2 :text="outer" id="outer"></h2>
      <nested-element id="nested-element"></nested-element>
    `
  }
}

class NestedElement extends Shadowbind.Element {
  subscribe () {
    return { inner: 'state' }
  }
  bindings ({ inner = null }) {
    return { inner }
  }
  template () {
    return /* @html */`<h2 :text="inner" id="inner"></h2>`
  }
}

Shadowbind.define({ BindNested, NestedElement })
