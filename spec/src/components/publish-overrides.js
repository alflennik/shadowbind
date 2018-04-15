import Shadowbind from '../../../src/index.js'

class PublishOverrides extends window.HTMLElement {
  subscribe () {
    return { stick: 'state' }
  }
  getActual () {
    Shadowbind.publish({ stick: 'sticky', stink: 'stinky' })
    this.publish({ stink: false, dynamic: 'dynamo' })
    return this.data
  }
  getExpected () {
    return { stick: 'sticky', stink: false, dynamic: 'dynamo' }
  }
  bindings (data) {
    this.data = data
    return {}
  }
  template () {
    return ''
  }
}

Shadowbind.define(PublishOverrides)
