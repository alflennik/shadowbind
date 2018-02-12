import define from '../../../src/index.js'

class EventType extends window.HTMLElement {
  template () {
    return /* @html */`<div on:click='aString'></div>`
  }
  async getExpected () {
    return 'shadowbind_event_type'
  }
  async getActual () {
    try {
      this.publish({ aString: 'yayyy' })
    } catch (err) {
      return err.code || err.message
    }
  }
}

define(EventType)
