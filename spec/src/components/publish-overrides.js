import define, { publish } from '../../../src/index.js'

class PublishOverrides extends window.HTMLElement {
  subscribe () {
    return { stick: 'state' }
  }
  getActual () {
    publish({ stick: 'sticky', stink: 'stinky' })
    this.publish({ stink: false, dynamic: 'dynamo' })
    return this.data
  }
  getExpected () {
    return { stick: 'sticky', stink: false, dynamic: 'dynamo' }
  }
  bind (data) {
    this.data = data
    return {}
  }
  template () {
    return ''
  }
}

define(PublishOverrides)
