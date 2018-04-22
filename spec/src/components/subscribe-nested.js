import Shadowbind from '../../../src/index.js'

let state

class SubscribeNested extends Shadowbind.Element {
  subscribe () {
    return {
      myVal: [{ state: 'level1.level2.level3' }, { state: 'nested.not.found' }]
    }
  }
  getActual () {
    Shadowbind.publish({ level1: { level2: { level3: 'yo!' } } })
    return state
  }
  getExpected () {
    return 'yo!'
  }
  bindings ({ myVal }) {
    state = myVal
    return {}
  }
  template () {
    return ''
  }
}

Shadowbind.define({ SubscribeNested })
