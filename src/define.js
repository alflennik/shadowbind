import trace from './lib/trace.js'
import error from './lib/error.js'
import getType from './util/getType.js'
import pascalToTrainCase from './util/pascalToTrainCase.js'
import bindComponent from './lib/bindComponent.js'

let components = []
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

  class ShadowComponent extends Component {
    constructor () {
      super()
      if (Component.prototype.template) {
        this.attachShadow({ mode: 'open' })
        const template = document.createElement('template')
        template.innerHTML = Component.prototype.template.call(this)
        this.shadowRoot.appendChild(template.content.cloneNode(true))
      }
    }
    publish (bindings) {
      bindComponent(this, bindings)
    }
  }

  window.customElements.define(name, ShadowComponent)

  components.push({ Component })
}
