import trace from './lib/trace.js'
import error from './lib/error.js'
import getType from './util/getType.js'
import pascalToTrainCase from './util/pascalToTrainCase.js'
import bindComponent from './lib/bindComponent.js'
import parseSubscriptions from './lib/parseSubscriptions.js'

let components = {}
let componentId = 0
export { components }

export default function define (name, Component = {}) {
  trace.reset()
  if (!arguments.length) {
    error(
      'shadowbind_define_without_arguments',
      'The first argument of define() should be a class extending ' +
        'HTMLElement, but no arguments were given'
    )
  }

  if (arguments.length === 1) {
    // Name is optional
    Component = name
    name = pascalToTrainCase(Component.name)
  }

  if (!(Component.prototype instanceof window.HTMLElement)) {
    error(
      'shadowbind_subscribe_type',
      'The first argument of define() should be a class extending ' +
        `HTMLElement, not "${getType(Component)}"`
    )
  }

  const subscriptions = Component.prototype.subscribe
    ? Component.prototype.subscribe()
    : {}

  const { stateSubscriptions, attributeSubscriptions } = parseSubscriptions(
    subscriptions
  )

  class ShadowComponent extends Component {
    static observedAttributes () {
      return attributeSubscriptions
    }
    constructor () {
      super()
      if (!this.sbPrivate) this.sbPrivate = {}

      if (Component.prototype.template) {
        this.attachShadow({ mode: 'open' })
        const template = document.createElement('template')
        template.innerHTML = Component.prototype.template.call(this)
        this.shadowRoot.appendChild(template.content.cloneNode(true))
      }

      if (stateSubscriptions.length) {
        this.sbPrivate.stateSubscriptions = stateSubscriptions
      }

      this.sbPrivate.subscriptions = subscriptions
    }
    connectedCallback () {
      componentId++
      this.sbPrivate.id = componentId
      components[componentId] = this
      forwardProperty(Component, 'connectedCallback')
    }
    disconnectedCallback () {
      delete components[componentId]
      forwardProperty(Component, 'disconnectedCallback')
    }
    publish (bindings) {
      bindComponent(this, bindings)
    }
  }

  window.customElements.define(name, ShadowComponent)
}

function forwardProperty (Component, propertyName) {
  if (Component.prototype[propertyName]) {
    Component.prototype[propertyName].call(this)
  }
}
