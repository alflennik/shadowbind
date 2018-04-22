import Shadowbind from '../../../src/index.js'

class ShowText extends Shadowbind.Element {
  subscribe () {
    return { text: 'state' }
  }
  template () {
    return /* @html */`
      <span :text="text" id="test">just some placeholder text</span>
    `
  }
}

class DataProp extends Shadowbind.Element {
  subscribe () {
    return { text: 'state', alternate: 'state' }
  }
  getActual () {
    const testElement = this.shadowRoot.querySelector('#show-text').shadowRoot
    const otherElement = this.shadowRoot.querySelector('#other-text').shadowRoot
    let tests = []
    Shadowbind.publish({ text: 'default text', alternate: {} })
    tests.push(testElement.querySelector('#test').innerText)
    tests.push(otherElement.querySelector('#test').innerText)
    Shadowbind.publish({ text: null, alternate: { text: 'overridden text' } })
    tests.push(testElement.querySelector('#test').innerText)
    tests.push(otherElement.querySelector('#test').innerText)
    return tests
  }
  getExpected () {
    return [
      'default text',
      'default text',
      'overridden text',
      'default text'
    ]
  }
  template () {
    return /* @html */`
      <show-text prop:data="alternate" id="show-text"></show-text>
      <show-text id="other-text"></show-text>
    `
  }
}

Shadowbind.define(DataProp)
Shadowbind.define(ShowText)
