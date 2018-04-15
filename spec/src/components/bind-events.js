import Shadowbind from '../../../src/index.js'

let counter = 0

class BindEvents extends window.HTMLElement {
  template () {
    return /* @html */`
      <button on:click="incrementCounter" :text="counter"></button>
    `
  }
  incrementCounter (event) {
    counter++
    this.publish({ counter })
  }
  getExpected () {
    return [0, 1, 2]
  }
  getActual () {
    this.publish({ counter })
    const button = this.shadowRoot.querySelector('button')
    let tests = []
    tests.push(counter)
    button.dispatchEvent(new Event('click')) // eslint-disable-line
    tests.push(counter)
    button.dispatchEvent(new Event('click')) // eslint-disable-line
    tests.push(counter)
    return tests
  }
}

define(BindEvents)
