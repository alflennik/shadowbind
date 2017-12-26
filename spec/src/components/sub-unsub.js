import { subscribe, unsubscribe, publish } from '../../../src/index.js'

class SubUnsub extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <span :text="myText"></span>`
  }
  connectedCallback () {
    subscribe(this)
  }
  disconnectedCallback () {
    unsubscribe(this)
  }
  getActual () {
    const parent = this.parentNode
    let tests = {}
    publish({ myText: 'success' })
    tests.first = this.shadowRoot.querySelector('span').innerText
    parent.removeChild(this)
    publish({ myText: 'should not appear' })
    tests.second = this.shadowRoot.querySelector('span').innerText
    parent.insertBefore(this, null)
    publish({ myText: 'should appear' })
    tests.third = this.shadowRoot.querySelector('span').innerText
    return tests
  }
  getExpected () {
    return { first: 'success', second: 'success', third: 'should appear' }
  }
}

window.customElements.define('sub-unsub', SubUnsub)
