import Shadowbind from '../../../src/index.js'

let state

class SubscribeRename extends window.HTMLElement {
  subscribe () {
    return { remapped: { state: 'sourceState' } }
  }
  getActual () {
    Shadowbind.publish({ sourceState: 123 })
    return state
  }
  getExpected () {
    return 123
  }
  bind ({ remapped }) {
    state = remapped
    return {}
  }
  template () {
    return ''
  }
}

Shadowbind.define(SubscribeRename)
