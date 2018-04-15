import Shadowbind from '../../../src/index.js'

let state
let bindCount = 0

class SubscribeStateMutations extends window.HTMLElement {
  subscribe () {
    return {
      mutations: [{ state: 'level1.level2' }]
    }
  }
  getActual () {
    let values = []
    let counts = []

    let nestedState = { level1: { level2: 'yo!' } }
    publish(nestedState)
    values.push(state)
    counts.push(bindCount)

    nestedState.level1.level2 = 'hello!'
    publish(nestedState)
    values.push(state)
    counts.push(bindCount)

    let nested2 = { abc: { dce: 123 } }
    nestedState.level1.level2 = nested2
    publish(nestedState)
    values.push(JSON.stringify(state))
    counts.push(bindCount)

    nested2.abc.dce = 456
    publish(nestedState)
    values.push(JSON.stringify(state))
    counts.push(bindCount)

    return { values, counts }
  }
  getExpected () {
    return {
      values: ['yo!', 'hello!', '{"abc":{"dce":123}}', '{"abc":{"dce":456}}'],
      counts: [1, 2, 3, 4] // this confirms SB detected the change in state
    }
  }
  bind ({ mutations }) {
    bindCount++
    state = mutations
    return {}
  }
  template () {
    return ''
  }
}

define(SubscribeStateMutations)
