import Shadowbind from '../../../src/index.js'

let counter = 0

class BindEvents extends Shadowbind.Element {
  template () {
    return /* @html */`
      <button on:click="incrementCounter" :text="counter"></button>
    `
  }
  incrementCounter (event) {
    counter++
    this.data({ counter })
  }
  getExpected () {
    return [0, 1, 2]
  }
  getActual () {
    this.data({ counter })
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

Shadowbind.define({ BindEvents })
