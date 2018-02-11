import define, { publish } from '../../../src/index.js'

class ShowText extends window.HTMLElement {
  template () {
    return /* @html */`
      <span :text="text" id="test">just some placeholder text</span>
    `
  }
}

class PublishMethod extends window.HTMLElement {
  template () {
    return /* @html */`
      <show-text :publish="alternateText" id="show-text"></show-text>
      <show-text id="other-text"></show-text>
    `
  }
  getActual () {
    const testElement = this.shadowRoot.querySelector('#show-text').shadowRoot
    const otherElement = this.shadowRoot.querySelector('#other-text').shadowRoot
    let tests = []
    publish({ text: 'should not appear', alternateText: null })
    tests.push(testElement.querySelector('#test').innerText)
    tests.push(otherElement.querySelector('#test').innerText)
    publish({ text: null, alternateText: 'alternateText appears' })
    tests.push(testElement.querySelector('#test').innerText)
    tests.push(otherElement.querySelector('#test').innerText)
    return tests
  }
  getExpected () {
    return [
      'just some placeholder text',
      'should not appear',
      'alternateText appears',
      'should not appear'
    ]
  }
}

define(PublishMethod)
define(ShowText)
