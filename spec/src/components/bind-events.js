import { subscribe, publish } from '../../../src/index.js'

let counter = 0

class BindEvents extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = /* @html */`
    <button on:click="incrementCounter" :text="counter"></button>`
  }
  bind (state) {
    return {
      ...state,
      incrementCounter: event => {
        counter++
        publish({ counter })
      }
    }
  }
  getExpected () {
    return [0, 1, 2]
  }
  getActual () {
    publish({ counter })
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

window.customElements.define('bind-events', BindEvents)
