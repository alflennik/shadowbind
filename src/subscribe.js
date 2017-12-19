import trace from './lib/trace.js'
import error from './lib/error.js'
import attachPublish from './lib/attachPublish.js'
import getType from './util/getType.js'

let components = []
export { components }

// Track subscribed web components
export default function subscribe (component, stateKey) {
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

  attachPublish(component)

  components.push({ component, stateKey })
}
