import { define, publish } from '../../../src/index.js'

let state

class SubscribeMultiple extends window.HTMLElement {
  subscribe () {
    return { myVal: [{ state: 'usedFirst' }, { state: 'usedSecond' }] }
  }
  getActual () {
    let tests = []
    publish({ usedSecond: 'not used!', usedFirst: 'is used!' })
    tests.push(state)
    publish({ usedSecond: 'should be used!' })
    tests.push(state)
    return tests
  }
  getExpected () {
    return ['is used!', 'should be used!']
  }
  bind ({ myVal }) {
    state = myVal
    return {}
  }
  template () {
    return ''
  }
}

define(SubscribeMultiple)
