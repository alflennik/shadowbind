import store from './reducers'
import { subscribe } from '../lib/domino'

export default class UIHeadline extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this, 'friends')
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = /* @html */`
    `
  }

  bind (color) {
    return {
      css: {
        color: color
      },
      toggleColor: () => store.dispatch({ type: 'TOGGLE_COLOR' })
    }
  }
}

window.customElements.define('ui-headline', UIHeadline)
