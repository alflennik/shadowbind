import store from './reducers'
import { subscribe } from '../lib/domino'

export default class UIHeadline extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this, 'color')
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = /* @html */`
    <h1 on:click="toggleColor"><slot></slot></h1>
    <ul>
      <li loop:for="friends" loop:key="id" bind:class="final" class="friends">
        <h2 bind:text="friends[i].name"></h2>
        <p bind:text="friends[i].title"></p>
      </li>
    </ul>
    <ui-counter></ui-counter>
    <style>
      div {
        border: 5px solid #eee;
        margin: 20px;
        padding: 20px;
      }
      h1 {
        color: var(--color);
      }
      .friends {
        color: coral;
      }
      .final {
        color: blue;
      }
    </style>`
  }

  bind (color) {
    return {
      css: {
        color: color
      },
      events: {
        toggleColor: () => store.dispatch({ type: 'TOGGLE_COLOR' })
      }
    }
  }
}

window.customElements.define('ui-headline', UIHeadline)
