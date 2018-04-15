import Shadowbind from '../../../src/index.js'

let counter = 0

class BindEventsAdvanced extends window.HTMLElement {
  template () {
    return /* @html */`
      <div :text="counter"></div>
      <input on:focus,blur,input="updateCounter">
    `
  }
  updateCounter (event) {
    counter++
    this.data({ counter })
  }
  getExpected () {
    return [0, 1, 2, 3]
  }
  getActual () {
    this.data({ counter })
    let tests = []
    const testEl = document.querySelector('bind-events-advanced').shadowRoot
    const input = testEl.querySelector('input')
    tests.push(counter)
    input.dispatchEvent(new Event('focus')) // eslint-disable-line no-undef
    tests.push(counter)
    input.dispatchEvent(new Event('blur')) // eslint-disable-line no-undef
    tests.push(counter)
    input.dispatchEvent(new Event('input')) // eslint-disable-line no-undef
    tests.push(counter)
    return tests
  }
}

Shadowbind.define(BindEventsAdvanced)
