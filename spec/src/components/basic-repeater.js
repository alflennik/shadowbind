import { subscribe, publish } from '../../../src/shadowbind.js'

const template = document.createElement('template')
template.innerHTML = /* @html */`
  <style>:host li { list-style-type: none }</style>
  <li :for="location of locations" :key="name">
    <h2 :text="location"></h2>
  </li>
  <h2 :text="test"></h2>
`

class BasicRepeater extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  connectedCallback () {
    subscribe(this)
  }

  async getExpected () {
  }

  async getActual () {
    publish({
      locations: [
        { name: 'Seattle', population: '1 million' },
        { name: 'Tacoma', population: '400 thousand' },
        { name: 'Port Orchard', population: '80 thousand' }
      ],
      test: 'Is this working?'
    })
  }
}

window.customElements.define('basic-repeater', BasicRepeater)
