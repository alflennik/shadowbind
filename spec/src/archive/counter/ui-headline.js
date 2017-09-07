import store from './reducers'
import { subscribe } from '../lib/domino'

export default class UIHeadline extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this, 'headline')
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = /* @html */`
    <div :css="css">
      <h1><slot></slot></h1>
      <button on:click="toggleColor">Toggle Color</button>
      <button on:click="bolder">Make bolder</button>
    </div>
    <style>
      div {
        border: 5px solid #eee;
        margin: 20px;
        padding: 20px;
        text-align: center;
      }
      h1 {
        color: var(--color);
        font-weight: var(--boldness);
      }
    </style>`
  }

  bind (headlineState) {
    return {
      css: headlineState,
      toggleColor: () => store.dispatch({ type: 'TOGGLE_COLOR' }),
      bolder: () => store.dispatch({ type: 'MAKE_BOLDER' })
    }
  }
}

window.customElements.define('ui-headline', UIHeadline)
