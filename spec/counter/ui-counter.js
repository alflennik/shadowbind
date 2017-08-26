import store from './reducers'
import { subscribe } from '../lib/domino'

class UICounter extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this, 'counter')
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = /* @html */`
    <b>Counting to <span :text="counter"></span></b>
    <button on:click="increase">Increase</button>
    <button on:click="decrease">Decrease</button>
    <div :show="exceeded">
      <input type="checkbox" attr:checked="exceededCheckbox">
      You have exceeded!
    </div>`
  }

  bind (counter) {
    const exceeded = counter > 3 ? true : null
    return {
      counter,
      exceeded,
      exceededCheckbox: exceeded ? 'checked' : null,
      increase: () => store.dispatch({ type: 'INCREMENT' }),
      decrease: () => store.dispatch({ type: 'DECREMENT' })
    }
  }
}

window.customElements.define('ui-counter', UICounter)
