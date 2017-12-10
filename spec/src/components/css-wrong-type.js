import { subscribe, publish } from '../../../dist/shadowbind.js'

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
      return err.code || err
    }
    return 'no errors'
  }

  getExpected () {
    return 'shadowbind_css_type'
  }
}

window.customElements.define('css-wrong-type', CssWrongType)
