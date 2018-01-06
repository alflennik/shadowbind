import { subscribe, publish } from '../../../src/index.js'

class ShowText extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <span :text="text" id="test">just some placeholder text</span>`
  }
  connectedCallback () {
    subscribe(this, 'text')
  }
  bind (state) {
    return { text: state }
  }
}

class PublishMethod extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <show-text :publish="alternateText" id="show-text"></show-text>
    <show-text id="other-text"></show-text>`
  }
  connectedCallback () {
    subscribe(this)
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

window.customElements.define('publish-method', PublishMethod)
window.customElements.define('show-text', ShowText)
