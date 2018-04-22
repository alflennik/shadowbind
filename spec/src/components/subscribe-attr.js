import Shadowbind from '../../../src/index.js'

class SubscribeAttr extends Shadowbind.Element {
  subscribe () {
    return { attribute: 'attr', camelCased: 'attr' }
  }
  getActual () {
    this.setAttribute('attribute', 'testing an attribute!')
    this.setAttribute('camel-cased', 'and another!')
    return this.results
  }
  getExpected () {
    return { attribute: 'testing an attribute!', camelCased: 'and another!'}
  }
  beforeBindCallback () {
    this.results = this.data()
    return {}
  }
  template () {
    return ''
  }
}

Shadowbind.define({ SubscribeAttr })
