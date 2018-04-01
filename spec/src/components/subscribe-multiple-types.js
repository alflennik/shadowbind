import { define, publish } from '../../../src/index.js'

let mixed

class SubscribeMultipleTypes extends window.HTMLElement {
  subscribe () {
    return {
      mixed: ['state', 'prop', { attr: 'mixed', callback: val => Number(val) }],
      unrelated: ['attr']
    }
  }
  getActual () {
    let tests = []
    publish({ mixed: 1 })
    tests.push(mixed)
    this.mixed(2)
    tests.push(mixed)
    this.setAttribute('mixed', 3)
    tests.push(mixed)
    this.setAttribute('unrelated', 'should ignore')
    publish({ somethingUnrelated: 'abc' })
    this.publish({ anotherUnrelated: 'dce' })
    tests.push(mixed) // Should reuse previous value here
    publish({ mixed: 4 })
    tests.push(mixed)
    this.publish({ mixed: 5 })
    tests.push(mixed)
    publish({ mixed: 4 }) // Should be ignored since it hasn't changed
    tests.push(mixed)
    return tests
  }
  getExpected () {
    return [1, 2, 3, 3, 4, 5, 5]
  }
  bind ({ mixed: newMixedValue }) {
    mixed = newMixedValue
    return {}
  }
  template () {
    return ''
  }
}

define(SubscribeMultipleTypes)
