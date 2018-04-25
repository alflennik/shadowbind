import trace from './lib/trace.js'
import getType from './util/getType.js'
import error from './lib/error.js'
import * as queue from './lib/queue.js'
import * as connectedComponents from './lib/connectedComponents.js'
import { titleToTrain, trainToCamel, camelToTrain } from './util/convertCase.js'
import parseSubscriptions from './lib/parseSubscriptions.js'
import ShadowbindElement from './Element.js'

export default function define (Components) {
  trace.reset()
  if (!arguments.length) {
    error(
      'shadowbind_define_without_arguments',
      'The first argument of define() should an object but no arguments were ' +
        'given'
    )
  }

  queue.stop()
  for (const [name, Component] of Object.entries(Components)) {
    defineComponent(name, Component)
  }
  queue.start()
}

function defineComponent (name, Component) {
  if (!(Component.prototype instanceof ShadowbindElement)) {
    error(
      'shadowbind_define_type',
      'The first argument of define() should be an object where the keys are ' +
        'component names and the values are classes extending ' +
        `Shadowbind.Element`
    )
  }

  if (/^[A-Z]/.test(name)) name = titleToTrain(name)
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
      if (this.sbPrivate.observedProps.length) {
        for (const prop of this.sbPrivate.observedProps) {
          this[prop] = value => {
            queue.add(this, { props: { [prop]: value } })
          }
        }
      }
    }
    connectedCallback () {
      connectedComponents.add(this.sbPrivate.id, this)
      forwardProperty(this, Component, 'connectedCallback')
      this.sbPrivate.afterConnectedCallback()
    }
    disconnectedCallback () {
      connectedComponents.remove(this.sbPrivate.id)
      forwardProperty(this, Component, 'disconnectedCallback')
    }
    attributeChangedCallback (attrName, oldValue, newValue) {
      queue.add(this, { attrs: { [trainToCamel(attrName)]: newValue } })
      forwardProperty(this, Component, 'attributeChangedCallback', arguments)
    }
  }

  window.customElements.define(name, ShadowComponent)
}

function forwardProperty (component, Component, propertyName, args = []) {
  if (Component.prototype[propertyName]) {
    Component.prototype[propertyName].call(component, ...args)
  }
}

function validateName (Component, name, isImplicit) {
  if (!(
    name.indexOf('--') !== -1 ||
    name.indexOf('-') === -1 ||
    /^-/.test(name) !== false ||
    /-$/.test(name) !== false ||
    /[^a-zA-Z0-9-]/.test(name) !== false
  )) return

  error(
    `shadowbind_component_name`,
    `Web component name "${name}" was invalid - note that names must be two ` +
      `words.`
  )
}
