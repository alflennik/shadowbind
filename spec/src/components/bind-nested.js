import { subscribe, publish } from '../../../src/index.js'

class BindNested extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <h2 :text="outer" id="outer"></h2>
    <nested-element id="nested-element"></nested-element>
    `
  }

  async getExpected () {
    return {
      outer: 'test',
      inner: 'test2'
    }
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

class NestedElement extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <h2 :text="inner" id="inner"></h2>
    `
  }

  bind () {
    return {
      inner: 'test2'
    }
  }
}

window.customElements.define('bind-nested', BindNested)
window.customElements.define('nested-element', NestedElement)
