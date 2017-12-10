import { subscribe } from '../../../src/index.js'

class SubscribeWrongType extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.errorCode = 'no_error'
    try {
      subscribe('wrong type given')
    } catch (err) {
      this.errorCode = err.code || err
    }
  }

  getActual () {
    return this.errorCode
  }

  getExpected () {
    return 'shadowbind_subscribe_type'
  }
}

window.customElements.define('subscribe-wrong-type', SubscribeWrongType)
