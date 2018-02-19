import define, { publish } from '../../../src/index.js'

let state

class SubscribeNested extends window.HTMLElement {
  subscribe () {
    return {
      myVal: [{ state: 'level1.level2.level3' }, { state: 'nested.not.found' }]
    }
  }
  getActual () {
    publish({ level1: { level2: { level3: 'yo!' } } })
    return state
  }
  getExpected () {
    return 'yo!'
  }
  bind ({ myVal }) {
    state = myVal
    return {}
  }
  template () {
    return ''
  }
}

define(SubscribeNested)
