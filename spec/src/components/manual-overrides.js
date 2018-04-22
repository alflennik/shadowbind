import Shadowbind from '../../../src/index.js'

class ManualOverrides extends Shadowbind.Element {
  subscribe () {
    return { stick: 'state' }
  }
  getActual () {
    Shadowbind.publish({ stick: 'sticky', stink: 'stinky' })
    this.data({ stink: false, dynamic: 'dynamo' })
    return this.results
  }
  getExpected () {
    return { stick: 'sticky', stink: false, dynamic: 'dynamo' }
  }
  bindings (data) {
    this.results = data
    return {}
  }
  template () {
    return ''
  }
}

Shadowbind.define({ ManualOverrides })
