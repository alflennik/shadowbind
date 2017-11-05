import { subscribe, publish } from '../../../src/shadowbind.js'

class BasicBindings extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = /* @html */`
    <span :text="text" id="text"></span>
    <span :text="escaping" id="escaping"></span>
    <span :html="html" id="html"></span>
    <span :show="show" id="show"></span>
    <span :show="hide" id="hide"></span>
    <span bind:my-attr="myAttr" id="my-attr"></span>
    <span bind:none="none" id="none"></span>`
  }

  async getExpected () {
    return {
      text: 'This text',
      escaping: '&lt;/span&gt;',
      html: 'This html',
      show: '',
      hide: 'none',
      myAttr: 'This attr',
      none: null
    }
  }

  async getActual () {
    publish({
      text: 'This text',
      escaping: '</span>',
      html: 'This html',
      show: true,
      hide: false,
      myAttr: 'This attr',
      none: null
    })

    return {
      text: this.root.getElementById('text').innerHTML,
      escaping: this.root.getElementById('escaping').innerHTML,
      html: this.root.getElementById('html').innerHTML,
      show: this.root.getElementById('show').style.display,
      hide: this.root.getElementById('hide').style.display,
      myAttr: this.root.getElementById('my-attr').getAttribute('my-attr'),
      none: this.root.getElementById('none').getAttribute('none')
    }
  }
}

window.customElements.define('basic-bindings', BasicBindings)
