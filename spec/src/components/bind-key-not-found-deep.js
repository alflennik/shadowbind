import { subscribe, publish } from '../../../dist/shadowbind.js'

class BindKeyNotFoundDeep extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <div :text='level1.level2.level3'></div>
    `
  }

  async getExpected () {
    return 'shadowbind_key_not_found'
  }

  async getActual () {
    try {
      publish({ level1: { level2: {} } })
    } catch (err) {
      return err.code || err
    }
  }
}

window.customElements.define('bind-key-not-found-deep', BindKeyNotFoundDeep)
