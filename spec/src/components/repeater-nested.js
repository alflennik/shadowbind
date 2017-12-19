import { subscribe, publish } from '../../../src/index.js'

const template = document.createElement('template')
template.innerHTML = /* @html */`
  <ul :for="country of countries" :key="name">
    <h2 :text="country.name"></h2>
    <li :for="export of country.exports" :key="name">
      A export of <span :text="country.name"></span> is
      <span :text="export"></span>
    </li>
  </ul>
`

class RepeaterNested extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  connectedCallback () {
    subscribe(this)
  }

  async getExpected () {
    // return {
    //   beforeText: 'Before the Repeater',
    //   seattleName: 'Seattle',
    //   seattlePop: '1 million',
    //   tacomaName: 'Tacoma',
    //   tacomaPop: '400 thousand',
    //   orchardName: 'Port Orchard',
    //   orchardPop: '80 thousand',
    //   afterText: 'After the Repeater'
    // }
  }

  async getActual () {
    publish({
      countries: [
        { name: 'USA', exports: ['Video Games', 'Medical Bills'] },
        { name: 'Canada', exports: ['Music', 'Apologies'] }
      ]
    })

    // const root = this.shadowRoot
    // return {
    //   beforeText: root.querySelector('#beforeText').innerText,
    //   seattleName: root.querySelector('.looped:nth-of-type(1) h2').innerText,
    //   seattlePop: root.querySelector('.looped:nth-of-type(1) span').innerText,
    //   tacomaName: root.querySelector('.looped:nth-of-type(2) h2').innerText,
    //   tacomaPop: root.querySelector('.looped:nth-of-type(2) span').innerText,
    //   orchardName: root.querySelector('.looped:nth-of-type(3) h2').innerText,
    //   orchardPop: root.querySelector('.looped:nth-of-type(3) span').innerText,
    //   afterText: root.querySelector('#afterText').innerText
    // }
  }
}

window.customElements.define('repeater-nested', RepeaterNested)
