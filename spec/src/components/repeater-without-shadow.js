import { subscribe, publish } from '../../../src/index.js'

class RepeaterWithoutShadow extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <div :for="myData"></div>`
  }

  connectedCallback () {
    subscribe(this)
  }

  getActual () {
    try {
      publish({ myData: [1, 2, 3] })
    } catch (err) {
      return err.code || err
    }
    return 'no errors'
  }

  getExpected () {
    return 'shadowbind_for_without_shadow_root'
  }
}

window.customElements.define('repeater-without-shadow', RepeaterWithoutShadow)
