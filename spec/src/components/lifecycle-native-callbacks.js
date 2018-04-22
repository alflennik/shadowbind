import Shadowbind from '../../../src/index.js'

function disconnectAndReconnect (element) {
  const parent = element.parentElement
  const referenceElement = element.nextElementSibling
  parent.removeChild(element)
  parent.insertBefore(element, referenceElement)
}

class LifecycleNativeCallbacks extends Shadowbind.Element {
  static observedAttributes () {
    return ['tester', 'testy']
  }
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.sequence = ['constructor']
  }
  getActual () {
    this.sequence.push('connect test started')
    disconnectAndReconnect(this)

    this.sequence.push('attribute test started')
    this.setAttribute('tester', 123)
    this.setAttribute('testy', 'abc')
    this.setAttribute('tester', 456)

    return this.sequence
  }
  getExpected () {
    return [
      'constructor',
      'connectedCallback',
      'connect test started',
      'disconnectedCallback',
      'connectedCallback',
      'attribute test started',
      'attributeChangedCallback(tester, null, 123)',
      'attributeChangedCallback(testy, null, abc)',
      'attributeChangedCallback(tester, 123, 456)'
    ]
  }
  connectedCallback () {
    this.sequence.push('connectedCallback')
  }
  disconnectedCallback () {
    this.sequence.push('disconnectedCallback')
  }
  attributeChangedCallback (attributeName, oldValue, newValue) {
    this.sequence.push(
      `attributeChangedCallback(${attributeName}, ${oldValue}, ${newValue})`
    )
  }
}

Shadowbind.define(LifecycleNativeCallbacks)
