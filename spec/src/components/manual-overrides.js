import Shadowbind from '../../../src/index.js'

class ManualOverrides extends Shadowbind.Element {
  subscribe () {
    return {
      setByStateOnly: 'state',
      overriddenByState: 'state',
      overriddenByData: 'state'
    }
  }
  getActual () {
    this.data({ overriddenByState: false })
    Shadowbind.publish({
      setByStateOnly: true,
      overriddenByData: false,
      overriddenByState: true
    })
    this.data({ overriddenByData: true })
    return this.data()
  }
  getExpected () {
    return {
      overriddenByState: true,
      setByStateOnly: true,
      overriddenByData: true
    }
  }
  template () {}
}

Shadowbind.define({ ManualOverrides })
