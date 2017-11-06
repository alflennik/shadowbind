import { subscribe, publish } from '../../../src/shadowbind.js'

class EventType extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <div on:click='aString'></div>
    `
  }

  async getExpected () {
    return 'shadowbind_event_type'
  }

  async getActual () {
    try {
      publish({ aString: 'yayyy' })
    } catch (err) {
      return err.code || err
    }
  }
}

window.customElements.define('event-type', EventType)
