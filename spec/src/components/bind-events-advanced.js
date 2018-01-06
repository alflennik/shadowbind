import { subscribe, publish } from '../../../src/index.js'

let counter = 0

class BindEventsAdvanced extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = /* @html */`
    <div :text="counter"></div>
    <input on:focus,blur,input="updateCounter">`
  }
  bind (state) {
    return {
      ...state,
      updateCounter: event => {
        counter++
        publish({ counter })
      }
    }
  }
  getExpected () {
    return [0, 1, 2, 3]
  }
  getActual () {
    publish({ counter })
    let tests = []
    const testEl = document.querySelector('bind-events-advanced').shadowRoot
    const input = testEl.querySelector('input')
    tests.push(counter)
    input.dispatchEvent(new Event('focus')) // eslint-disable-line
    tests.push(counter)
    input.dispatchEvent(new Event('blur')) // eslint-disable-line
    tests.push(counter)
    input.dispatchEvent(new Event('input')) // eslint-disable-line
    tests.push(counter)
    return tests
  }
}

window.customElements.define('bind-events-advanced', BindEventsAdvanced)
