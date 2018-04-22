import Shadowbind from '../../../src/index.js'

class InitialEvents extends Shadowbind.Element {
  getActual () {
    this.eventTriggered = false
    const button = this.shadowRoot.querySelector('button')
    button.dispatchEvent(new window.Event('click'))
    return this.eventTriggered
  }
  getExpected () {
    return true
  }
  increment () {
    this.eventTriggered = true
  }
  template () {
    return /* @html */`
      <button on:click="increment">Increment</button>
    `
  }
}

Shadowbind.define({ InitialEvents })
