import Shadowbind from '../../../src/index.js'

let latestValue

class SubscribeProperty extends window.HTMLElement {
  subscribe () {
    return { myProperty: 'prop' }
  }
  getActual () {
    this.myProperty('Setting a prop')
    return latestValue
  }
  getExpected () {
    return 'Setting a prop'
  }
  bind ({ myProperty }) {
    latestValue = myProperty
    return {}
  }
  template () {
    return ''
  }
}

Shadowbind.define(SubscribeProperty)
