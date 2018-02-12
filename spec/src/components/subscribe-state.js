import define, { publish } from '../../../src/index.js'

let state

class SubscribeState extends window.HTMLElement {
  template () {
    return ''
  }
  subscribe () {
    return { abc: 'state' }
  }
  bind ({ abc }) {
    state = abc
    return {}
  }
  getActual () {
    publish({ abc: true })
    return state
  }
  getExpected () {
    return true
  }
}

define(SubscribeState)
