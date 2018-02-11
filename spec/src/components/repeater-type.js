import { subscribe, publish } from '../../../src/index.js'

class CustomElem extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

class RepeaterType extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <custom-elem :for="notAnArray"></custom-elem>`
  }

  connectedCallback () {
    subscribe(this)
  }

  getActual () {
    try {
      publish({ notAnArray: 'instead a string' })
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }

  getExpected () {
    return 'shadowbind_for_type'
  }
}

window.customElements.define('repeater-type', RepeaterType)
window.customElements.define('custom-elem', CustomElem)
