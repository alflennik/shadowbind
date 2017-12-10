import { subscribe, publish } from '../../../src/index.js'

const template = document.createElement('template')
template.innerHTML = /* @html */`
  <style>:host li { list-style-type: none }</style>
  <h2 :text="beforeText"></h2>
  <li :for="location of locations" :key="name">
    <!-- <h2 :text="name"></h2> -->
    <h2 :text="beforeText"></h2>
    <p>Population <span :text="population"></span></p>
  </li>
  <h2 :text="afterText"></h2>
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
      beforeText: 'Before the Repeater',
      locations: [
        { name: 'Seattle', population: '1 million' },
        { name: 'Tacoma', population: '400 thousand' },
        { name: 'Port Orchard', population: '80 thousand' }
      ],
      afterText: 'After the Repeater'
    })
  }
}

window.customElements.define('basic-repeater', BasicRepeater)
