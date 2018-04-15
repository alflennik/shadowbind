import Shadowbind from '../../../src/index.js'

class EventType extends window.HTMLElement {
  template () {
    return /* @html */`<div on:click='aString'></div>`
  }
  async getExpected () {
    return 'shadowbind_event_type'
  }
  async getActual () {
    try {
      this.data({ aString: 'yayyy' })
    } catch (err) {
      return err.code || err.message
    }
  }
}

Shadowbind.define(EventType)
