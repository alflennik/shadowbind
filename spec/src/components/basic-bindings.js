import Shadowbind from '../../../src/index.js'

class BasicBindings extends Shadowbind.Element {
  template () {
    return /* @html */`
      <span :text="text" id="text"></span>
      <span :text="escaping" id="escaping"></span>
      <span :html="html" id="html"></span>
      <span :show="show" id="show"></span>
      <span :show="hide" id="hide"></span>
      <span attr:my-attr="myAttr" id="my-attr"></span>
      <span attr:none="none" id="none"></span>
    `
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
    this.data({
      text: 'This text',
      escaping: '</span>',
      html: 'This html',
      show: true,
      hide: false,
      myAttr: 'This attr',
      none: null
    })
    return {
      text: this.shadowRoot.querySelector('#text').innerHTML,
      escaping: this.shadowRoot.querySelector('#escaping').innerHTML,
      html: this.shadowRoot.querySelector('#html').innerHTML,
      show: this.shadowRoot.querySelector('#show').style.display,
      hide: this.shadowRoot.querySelector('#hide').style.display,
      myAttr: this.shadowRoot.querySelector('#my-attr').getAttribute('my-attr'),
      none: this.shadowRoot.querySelector('#none').getAttribute('none')
    }
  }
}

Shadowbind.define(BasicBindings)
