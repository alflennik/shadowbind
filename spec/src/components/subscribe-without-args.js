import { subscribe } from '../../../src/shadowbind.js'

class SubscribeWithoutArgs extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.errorCode = 'no_error'
    try {
      subscribe()
    } catch (err) {
      this.errorCode = err.code
    }
  }

  getActual () {
    return this.errorCode
  }

  getExpected () {
    return 'shadowbind_subscribe_without_arguments'
  }
}

window.customElements.define(
  'subscribe-without-args', SubscribeWithoutArgs)
