import define from '../../../src/index.js'

class CustomElem extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }
}

class RepeaterType extends window.HTMLElement {
  template () {
    return /* @html */`<custom-elem :for="notAnArray"></custom-elem>`
  }
  getActual () {
    try {
      this.publish({ notAnArray: 'instead a string' })
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_for_type'
  }
}

define(RepeaterType)
define(CustomElem)
