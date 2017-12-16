import { subscribe, publish } from '../../../src/index.js'

const template = document.createElement('template')
template.innerHTML = /* @html */`
  <style>:host li { list-style-type: none }</style>
  <h2 :text="beforeText" id="beforeText"></h2>
  <li :for="location of locations" :key="name" class="looped">
    <h2 :text="location.name"></h2>
    <p>Population <span :text="location.population"></span></p>
  </li>
  <h2 :text="afterText" id="afterText"></h2>
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

  test (testText) {
    publish({
      beforeText: 'Before the Repeater',
      locations: [
        { name: 'Tacoma', population: '400 thousand' },
        { name: 'Port Orchard', population: testText }
      ],
      afterText: 'After the Repeater'
    })
  }

  async getExpected () {
    return {
      beforeText: 'Before the Repeater',
      seattleName: 'Seattle',
      seattlePop: '1 million',
      tacomaName: 'Tacoma',
      tacomaPop: '400 thousand',
      orchardName: 'Port Orchard',
      orchardPop: '80 thousand',
      afterText: 'After the Repeater'
    }
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

    const root = this.shadowRoot
    return {
      beforeText: root.querySelector('#beforeText').innerText,
      seattleName: root.querySelector('.looped:nth-of-type(1) h2').innerText,
      seattlePop: root.querySelector('.looped:nth-of-type(1) span').innerText,
      tacomaName: root.querySelector('.looped:nth-of-type(2) h2').innerText,
      tacomaPop: root.querySelector('.looped:nth-of-type(2) span').innerText,
      orchardName: root.querySelector('.looped:nth-of-type(3) h2').innerText,
      orchardPop: root.querySelector('.looped:nth-of-type(3) span').innerText,
      afterText: root.querySelector('#afterText').innerText
    }
  }
}

window.customElements.define('basic-repeater', BasicRepeater)
