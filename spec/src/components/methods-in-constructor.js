import Shadowbind from '../../../src/index.js'

class MethodsInConstructor extends window.HTMLElement {
  constructor () {
    super()
    this.tests = []
    this.tests.push(this.data())
    try {
      this.form()
    } catch (err) {
      this.tests.push(err.code || err.message)
    }
    this.data({ message: 'Replacement message' })
    this.form({ textField: 'Replacement value' })
  }
  connectedCallback () {
    this.tests.push(this.data())
    this.tests.push(this.form())
    this.tests.push(this.shadowRoot.querySelector('#test1').value)
    this.tests.push(this.shadowRoot.querySelector('#test2').innerText)
  }
  getActual () {
    return this.tests
  }
  getExpected () {
    return [
      {},
      'shadowbind_form_without_shadow_root',
      { message: 'Replacement message' },
      { textField: 'to be replaced' },
      'Replacement message',
      'Replacement value'
    ]
  }
  template () {
    return /* @html */`
      <form>
        <input type="text" name="textField" value="to be replaced" id="test1">
      </form>
      <h1 :text="message" id="test2">Text to be replaced...</h1>
    `
  }
}

Shadowbind.define(MethodsInConstructor)
