import { subscribe } from '../../../dist/shadowbind.js'

class SubscribeUnattached extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
  }

  getActual () {
    return 'no errors'
  }

  getExpected () {
    return 'no errors'
  }
}

window.customElements.define('subscribe-unattached', SubscribeUnattached)
document.createElement('subscribe-unattached')
