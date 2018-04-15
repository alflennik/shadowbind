import Shadowbind from '../../../src/index.js'

class ShowText extends window.HTMLElement {
  subscribe () {
    return { text: 'state' }
  }
  template () {
    return /* @html */`
      <span :text="text" id="test">just some placeholder text</span>
    `
  }
}

class PublishMethod extends window.HTMLElement {
  subscribe () {
    return { text: 'state', alternate: 'state' }
  }
  getActual () {
    const testElement = this.shadowRoot.querySelector('#show-text').shadowRoot
    const otherElement = this.shadowRoot.querySelector('#other-text').shadowRoot
    let tests = []
    Shadowbind.publish({ text: 'default text', alternate: { text: null } })
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
      <show-text :publish="alternate" id="show-text"></show-text>
      <show-text id="other-text"></show-text>
    `
  }
}

Shadowbind.define(PublishMethod)
Shadowbind.define(ShowText)
