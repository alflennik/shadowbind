import Shadowbind from '../../../src/index.js'

let state

class SubscribeState extends Shadowbind.Element {
  subscribe () {
    return { abc: 'state' }
  }
  getActual () {
    Shadowbind.publish({ abc: true })
    return state
  }
  getExpected () {
    return true
  }
  bindings ({ abc }) {
    state = abc
    return {}
  }
  template () {
    return ''
  }
}

Shadowbind.define({ SubscribeState })
