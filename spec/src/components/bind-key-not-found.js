import { subscribe, publish } from '../../../src/index.js'

class BindKeyNotFound extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`<div :text='undefKey'></div>`
  }

  async getExpected () {
    return 'shadowbind_key_not_found'
  }

  async getActual () {
    try {
      publish({})
    } catch (err) {
      return err.code || err
    }
  }
}

window.customElements.define('bind-key-not-found', BindKeyNotFound)
