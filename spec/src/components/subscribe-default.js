import define, { publish } from '../../../src/index.js'

let state

class SubscribeDefault extends window.HTMLElement {
  subscribe () {
    return { test: { default: 'abc' } }
  }
  getActual () {
    publish()
    return state
  }
  getExpected () {
    return 'abc'
  }
  bind ({ test }) {
    state = test
    return {}
  }
  template () {
    return ''
  }
}

define(SubscribeDefault)
