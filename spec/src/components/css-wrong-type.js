import { subscribe, publish } from '../../../src/index.js'

class CssWrongType extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <div :css="notAnObject"></div>`
  }

  connectedCallback () {
    subscribe(this)
  }

  getActual () {
    try {
      publish({ notAnObject: 'instead a string' })
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }

  getExpected () {
    return 'shadowbind_css_type'
  }
}

window.customElements.define('css-wrong-type', CssWrongType)
