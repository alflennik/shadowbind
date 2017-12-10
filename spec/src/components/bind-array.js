import { subscribe, publish } from '../../../dist/shadowbind.js'

class BindArray extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <div :text='getArray'></div>
    `
  }

  async getExpected () {
    return 'shadowbind_binding_array_or_object'
  }

  async getActual () {
    try {
      publish({ getArray: [1, 2, 3] })
    } catch (err) {
      return err.code || err
    }
  }
}

window.customElements.define('bind-array', BindArray)
