import trace from './lib/trace.js'
import error from './lib/error.js'
import getType from './util/getType.js'

let components = {}
let componentsCount = 0
export { components }

// Track subscribed web components
export function subscribe (component, stateKey) {
  trace.reset()
  if (!arguments.length) {
    error(
      'shadowbind_subscribe_without_arguments',
      'The first argument of subscribe() should be a web component, but no ' +
        'arguments were given. Call subscribe(this) in the ' +
        'connectedCallback method of a web component'
    )
  }

  if (component && !component.classList) { // is dom element eslint-disable-line
    error(
      'shadowbind_subscribe_type',
      'The first argument of subscribe() should be a web component, not ' +
        `"${getType(component)}". Call subscribe(this) in the ` +
        'connectedCallback method of a web component'
    )
  }

  if (component.getAttribute(':publish') || component.getAttribute(':for')) {
    return // in these cases the state will be bound manually by the user
  }

  if (!component.sbPrivate) component.sbPrivate = {}
  const currentId = component.sbPrivate.id
  component.sbPrivate.stateKey = stateKey

  if (component.sbPrivate.id && components[currentId]) return // already subbed

  if (!currentId) {
    componentsCount++
    component.sbPrivate.id = componentsCount
  }

  components[componentsCount] = component
}

export function unsubscribe (component) {
  if (!component.sbPrivate || !component.sbPrivate.id) return
  delete components[component.sbPrivate.id]
}
