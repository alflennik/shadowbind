import Shadowbind from '../../../src/index.js'

let state

class SubscribeMultiple extends Shadowbind.Element {
  subscribe () {
    return { myVal: [{ state: 'usedFirst' }, { state: 'usedSecond' }] }
  }
  getActual () {
    let tests = []
    Shadowbind.publish({ usedSecond: 'not used!', usedFirst: 'is used!' })
    tests.push(state)
    Shadowbind.publish({ usedSecond: 'should be used!' })
    tests.push(state)
    return tests
  }
  getExpected () {
    return ['is used!', 'should be used!']
  }
  bindings ({ myVal }) {
    state = myVal
    return {}
  }
  template () {
    return ''
  }
}

Shadowbind.define(SubscribeMultiple)
