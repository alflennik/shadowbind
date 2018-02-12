import define, { publish } from '../../../src/index.js'

let state

class SubscribeRename extends window.HTMLElement {
  template () {
    return ''
  }
  subscribe () {
    return { remapped: { state: 'sourceState' } }
  }
  bind ({ remapped }) {
    state = remapped
    return {}
  }
  getActual () {
    publish({ sourceState: 123 })
    return state
  }
  getExpected () {
    return 123
  }
}

define(SubscribeRename)
