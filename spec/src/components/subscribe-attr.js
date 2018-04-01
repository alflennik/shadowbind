import { define } from '../../../src/index.js'

class SubscribeAttr extends window.HTMLElement {
  subscribe () {
    return { attribute: 'attr' }
  }
  getActual () {
    this.setAttribute('attribute', 'testing an attribute!')
    return this.binding
  }
  getExpected () {
    return 'testing an attribute!'
  }
  bind ({ attribute }) {
    this.binding = attribute
    return {}
  }
  template () {
    return ''
  }
}

define(SubscribeAttr)
