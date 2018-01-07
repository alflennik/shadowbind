import { subscribe, publish } from '../../../src/index.js'

function tryName (name) {
  try {
    publish({ invalidTagName: name })
  } catch (err) {
    console.log(err)
    return err.code || err
  }
  return 'no errors'
}

class InvalidTagName extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <div :tag="invalidTagName"></div>`
  }
  connectedCallback () {
    subscribe(this)
  }
  getActual () {
    return [
      tryName(true),
      tryName(123),
      tryName('1-numfirst'),
      tryName('almost-@valid')
    ]
  }
  getExpected () {
    return [
      'shadowbind_tag_name',
      'shadowbind_tag_name',
      'shadowbind_tag_name',
      'shadowbind_tag_name'
    ]
  }
}

window.customElements.define('invalid-tag-name', InvalidTagName)
