import { define, publish } from '../../../src/index.js'

let state

class SubscribeState extends window.HTMLElement {
  subscribe () {
    return { abc: 'state' }
  }
  getActual () {
    publish({ abc: true })
    return state
  }
  getExpected () {
    return true
  }
  bind ({ abc }) {
    state = abc
    return {}
  }
  template () {
    return ''
  }
}

define(SubscribeState)
