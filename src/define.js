import trace from './lib/trace.js'
import error from './lib/error.js'
import getType from './util/getType.js'
import { titleToTrain, trainToCamel, camelToTrain } from './util/convertCase.js'
import * as queue from './lib/queue.js'
import parseSubscriptions from './lib/parseSubscriptions.js'
import { getFormValues, setFormValues } from './util/formValues.js'

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

  if (arguments.length === 1) Component = name // Name is optional

  if (!(Component.prototype instanceof window.HTMLElement)) {
    error(
      'shadowbind_define_type',
      'The first argument of define() should be a class extending ' +
        `HTMLElement, not "${getType(Component)}"`
    )
  }

  if (arguments.length === 1) name = titleToTrain(Component.name)
  validateName(Component, name, arguments.length === 1)

  const rawSubscriptions = Component.prototype.subscribe
    ? Component.prototype.subscribe()
    : {}

  const { observedAttrs } = parseSubscriptions(rawSubscriptions)

  class ShadowComponent extends Component {
    static get observedAttributes () {
      let manualAttrs = (() => {
        if (getType(Component.observedAttributes) === 'function') {
          return Component.observedAttributes()
        }
        return []
      })()
      return observedAttrs.concat(manualAttrs).map(attr => camelToTrain(attr))
    }
    constructor () {
      super()
      if (!this.sbPrivate) this.sbPrivate = {}

      const {
        subscriptions,
        observedProps,
        observedState
      } = parseSubscriptions(this.subscribe ? this.subscribe() : {})

      this.sbPrivate.observedState = observedState
      this.sbPrivate.observedProps = observedProps
      this.sbPrivate.subscriptions = subscriptions

      if (Component.prototype.template) {
        this.attachShadow({ mode: 'open' })
        const template = document.createElement('template')
        template.innerHTML = Component.prototype.template.call(this)
        this.shadowRoot.appendChild(template.content.cloneNode(true))
      }

      if (observedProps.length) {
        for (const prop of observedProps) {
          this[prop] = value => {
            queue.add(this, { props: { [prop]: value } })
            // TODO: forward properties
          }
        }
      }

      this.sbPrivate.getDepth = () => {
        if (
          !this.parentNode ||
          !this.parentNode.host ||
          !this.parentNode.host.sbPrivate
        ) {
          return 0
        }
        return this.parentNode.host.sbPrivate.getDepth() + 1
      }
    }
    connectedCallback () {
      componentId++
      this.sbPrivate.id = componentId
      components[componentId] = this
      forwardProperty(this, Component, 'connectedCallback')
    }
    disconnectedCallback () {
      delete components[componentId]
      forwardProperty(this, Component, 'disconnectedCallback')
    }
    attributeChangedCallback (attrName, oldValue, newValue) {
      queue.add(this, { attrs: { [trainToCamel(attrName)]: newValue } })
      forwardProperty(this, Component, 'attributeChangedCallback', arguments)
    }
    data (bindings) {
      if (arguments.length === 0) return this.sbPrivate.data
      queue.add(this, { direct: bindings })
    }
    form (newValues) {
      const firstForm = this.shadowRoot.querySelector('form')
      if (!firstForm) {
        error(
          'shadowbind_missing_form',
          'Cannot use this.form() because there is no form in this component'
        )
      }
      if (arguments.length > 0) {
        return setFormValues(firstForm, newValues)
      } else {
        return getFormValues(firstForm)
      }
    }
  }

  window.customElements.define(name, ShadowComponent)
}

function forwardProperty (component, Component, propertyName, args = []) {
  if (Component.prototype[propertyName]) {
    Component.prototype[propertyName].call(component, ...args)
  }
}

function validateName(Component, name, isImplicit) {
  if (!(
    name.indexOf('--') !== -1 ||
    name.indexOf('-') === -1 ||
    /^-/.test(name) !== false ||
    /-$/.test(name) !== false ||
    /[^a-zA-Z0-9-]/.test(name) !== false
  )) return

  const errName = isImplicit ? 'implicit_component_name' : 'component_name'
  const details = isImplicit
    ? ` The name was automatically determined from your class name ` +
      `"${Component.name}".`
    : ''

  error(
    `shadowbind_${errName}`,
    `Web component name "${name}" was invalid - note that names must be two ` +
      `words.${details}`
  )
}
