import Shadowbind from '../../../src/index.js'

class MethodsInConstructor extends Shadowbind.Element {
  constructor () {
    super()
    this.tests = []
    this.tests.push(this.data())
    this.tests.push(this.form())
    this.tests.push(this.shadowRoot.querySelector('#test2').innerText)
    this.tests.push(this.shadowRoot.querySelector('#test1').value)
    this.data({ message: 'Replacement message' })
    this.form({ textField: 'Replacement value' })
    this.tests.push(this.data())
    this.tests.push(this.form())
    this.tests.push(this.shadowRoot.querySelector('#test2').innerText)
    this.tests.push(this.shadowRoot.querySelector('#test1').value)
  }
  connectedCallback () {
    this.tests.push('in connected callback')
    this.tests.push(this.data())
    this.tests.push(this.form())
    this.tests.push(this.shadowRoot.querySelector('#test2').innerText)
    this.tests.push(this.shadowRoot.querySelector('#test1').value)
  }
  getActual () {
    return this.tests
  }
  getExpected () {
    return [
      {},
      { textField: 'to be replaced' },
      'Text to be replaced...',
      'to be replaced',
      { message: 'Replacement message' },
      { textField: 'Replacement value' },
      'Replacement message',
      'Replacement value',
      'in connected callback',
      { message: 'Replacement message' },
      { textField: 'Replacement value' },
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
