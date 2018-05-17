import Shadowbind from '../../../src/index.js'

class RepeaterEvents extends Shadowbind.Element {
  getActual () {
    this.eventTriggered = false
    const button = this.shadowRoot.querySelector('button')
    button.dispatchEvent(new window.Event('click'))
    return this.eventTriggered
  }
  getExpected () {
    return ['tag-repeater-component', 'tag-repeater-component']
  }
  template () {
    return /* @html */`
      <div :map="myData" class="repeatedElement"></div>
    `
  }
}

class RepeaterEventCard extends Shadowbind.Element {
}

Shadowbind.define({ RepeaterEvents })
