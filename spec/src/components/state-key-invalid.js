import Shadowbind from '../../../src/index.js'

class StateKeyInvalid extends Shadowbind.Element {
  subscribe () {
    return { invalidKey: { state: 'firstKey.secondKey.' } }
  }
  getActual () {
    try {
      Shadowbind.publish({})
    } catch (err) {
      return err.code || err.message
    }
  }
  getExpected () {
    return 'shadowbind_subscribe_key_invalid'
  }
  template () {
    return ''
  }
}

Shadowbind.define(StateKeyInvalid)
