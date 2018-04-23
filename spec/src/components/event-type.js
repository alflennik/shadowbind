import Shadowbind from '../../../src/index.js'

class EventType extends Shadowbind.Element {
  getActual () {
    let tests = []

    try {
      this.data({})
    } catch (err) {
      tests.push(err.code || err.message)
    }

    try {
      this.handleEvent = 'aString'
      this.data({})
    } catch (err) {
      tests.push(err.code || err.message)
    }

    return tests
  }
  getExpected () {
    return ['shadowbind_undefined_event_method', 'shadowbind_event_type']
  }
  template () {
    return /* @html */`<div on:click='handleEvent'></div>`
  }
}

Shadowbind.define({ EventType })
