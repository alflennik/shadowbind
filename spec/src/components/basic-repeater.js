import { subscribe, publish } from '../../../src/index.js'

class BasicRepeater extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <h2 :text="beforeText" id="beforeText"></h2>
    <repeat-element :for="locations"></repeat-element>
    <h2 :text="afterText" id="afterText"></h2>
    `
  }

  async getExpected () {
    return true
  }

  async getActual () {
    publish({
      beforeText: 'Before the Locations',
      locations: [
        { name: 'Seattle', population: '1,000,000' },
        { name: 'Portland', population: '900,000' },
        { name: 'Tokyo', population: '24,000,000' }
      ],
      afterText: 'After the Locations'
    })
    return false
  }
}

class RepeatElement extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.innerHTML = /* @html */`
    <h2 :text="name"></h2>
    <p>Population: <span :text="population"></span></p>
    `
  }
}

window.customElements.define('basic-repeater', BasicRepeater)
window.customElements.define('repeat-element', RepeatElement)
