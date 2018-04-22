import Shadowbind from '../../../src/index.js'

class ThisDataSupport extends Shadowbind.Element {
  subscribe () {
    return { d: 'attr', e: 'prop' }
  }
  doEvent (event) {
    this.results = this.data()
  }
  getExpected () {
    return { a: 10, b: 20, c: 30, d: '40', e: 50 }
  }
  getActual () {
    this.data({ a: 10, b: 20, c: 30 })
    this.setAttribute('d', 40)
    this.e(50)
    const button = this.shadowRoot.querySelector('button')
    button.dispatchEvent(new Event('click')) // eslint-disable-line
    return this.results
  }
  template () {
    return /* @html */`<button on:click="doEvent">Do Event</button>`
  }
}

Shadowbind.define({ ThisDataSupport })
