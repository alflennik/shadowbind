import Shadowbind from '../../../src/index.js'

class StateKeyInvalid extends Shadowbind.Element {
  async getActual () {
    try {
      await Shadowbind.define({ SubscribeKeyInvalidExample })
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_invalid_subscribe'
  }
  template () {}
}

class SubscribeKeyInvalidExample extends Shadowbind.Element {
  subscribe () {
    return { invalidKey: { state: 'firstKey.secondKey.' } }
  }
  template () {}
}

Shadowbind.define({ StateKeyInvalid })
