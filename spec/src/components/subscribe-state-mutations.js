import Shadowbind from '../../../src/index.js'

let state
let bindCount = 0

class SubscribeStateMutations extends Shadowbind.Element {
  subscribe () {
    return {
      mutations: [{ state: 'level1.level2' }]
    }
  }
  getActual () {
    let values = []
    let counts = []
    counts.push(bindCount) // Should be bound once when initially created

    let nestedState = { level1: { level2: 'yo!' } }
    Shadowbind.publish(nestedState)
    values.push(state)
    counts.push(bindCount)

    nestedState.level1.level2 = 'hello!'
    Shadowbind.publish(nestedState)
    values.push(state)
    counts.push(bindCount)

    let nested2 = { abc: { dce: 123 } }
    nestedState.level1.level2 = nested2
    Shadowbind.publish(nestedState)
    values.push(JSON.stringify(state))
    counts.push(bindCount)

    nested2.abc.dce = 456
    Shadowbind.publish(nestedState)
    values.push(JSON.stringify(state))
    counts.push(bindCount)

    return { values, counts }
  }
  getExpected () {
    return {
      values: ['yo!', 'hello!', '{"abc":{"dce":123}}', '{"abc":{"dce":456}}'],
      counts: [1, 2, 3, 4, 5] // this confirms SB detected the change in state
    }
  }
  bindings ({ mutations = null }) {
    bindCount++
    state = mutations
    return { mutations: null }
  }
  template () {
    return /* @html */`
      <div :text="mutations"></div>
    `
  }
}

Shadowbind.define({ SubscribeStateMutations })
