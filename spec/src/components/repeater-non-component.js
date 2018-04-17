import Shadowbind from '../../../src/index.js'

class RepeaterNonComponent extends window.HTMLElement {
  getActual () {
    this.results = []
    try {
      this.data({ tag: 'valid-shadowbind-component', myData: [1, 2, 3] })
    } catch (err) {
      this.results.push(err.code || err.message)
    }

    try {
      this.data({ tag: 'non-shadowbind', myData: [1, 2, 3] })
    } catch (err) {
      this.results.push(err.code || err.message)
    }

    try {
      this.data({ tag: 'div', myData: [1, 2, 3] })
    } catch (err) {
      this.results.push(err.code || err.message)
    }

    return this.results
  }
  getExpected () {
    return [
      'shadowbind_map_non_component',
      'shadowbind_map_non_component'
    ]
  }
  template () {
    return /* @html */`
      <div :tag="tag" :map="myData"></div>
      <!-- <div :tag="tag"></div> -->
    `
  }
}

class NonShadowbindWebComponent extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

class ValidShadowbindComponent extends window.HTMLElement {
  template () {
    return ''
  }
}

window.customElements.define('non-shadowbind', NonShadowbindWebComponent)
Shadowbind.define(RepeaterNonComponent)
Shadowbind.define(ValidShadowbindComponent)
