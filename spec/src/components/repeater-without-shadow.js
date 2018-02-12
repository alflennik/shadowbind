import define from '../../../src/index.js'

class RepeaterWithoutShadow extends window.HTMLElement {
  template () {
    return /* @html */`<div :for="myData"></div>`
  }
  getActual () {
    try {
      this.publish({ myData: [1, 2, 3] })
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_for_without_shadow_root'
  }
}

define(RepeaterWithoutShadow)
