import { define, publish } from '../../../src/index.js'

class BindNested extends window.HTMLElement {
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
    publish({ outer: 'test', inner: 'test2' })
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

class NestedElement extends window.HTMLElement {
  template () {
    return /* @html */`<h2 :text="inner" id="inner"></h2>`
  }
  subscribe () {
    return { inner: 'state' }
  }
}

define(BindNested)
define(NestedElement)
