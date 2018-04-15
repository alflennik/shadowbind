import Shadowbind from '../../../src/index.js'

class InvalidTagName extends window.HTMLElement {
  template () {
    return /* @html */`<div :tag="invalidTagName"></div>`
  }
  tryName (name) {
    try {
      this.data({ invalidTagName: name })
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getActual () {
    return [
      this.tryName(true),
      this.tryName(123),
      this.tryName('1-numfirst'),
      this.tryName('almost-@valid')
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

Shadowbind.define(InvalidTagName)
