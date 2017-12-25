import trace from './lib/trace.js'
import { components } from './subscribe.js'
import error from './lib/error.js'
import applyStateKey from './lib/applyStateKey.js'
import getType from './util/getType.js'
import bindComponent from './lib/bindComponent.js'

let previousState = null
let bindMethodUsed
export { bindMethodUsed }

// Apply data-binding to all affected web components when the state changes
export default function publish (state) {
  trace.reset()
  trace.add('publishedState', state)
  if (previousState !== null && state === previousState) return

  for (const subscribedComponent of components) {
    const { component, stateKey } = subscribedComponent
    trace.add('component', component)

    if (
      previousState && stateKey && state[stateKey] === previousState[stateKey]
    ) continue

    let bindings
    const localState = applyStateKey(state, stateKey)

    if (component.bind) {
      if (getType(component.bind) !== 'function') {
        error(
          'shadowbind_bind_property_type',
          'A bind property was set on the component, but it was ' +
            `"${getType(component.bind)}" instead of type "function"`
        )
      }
      bindings = component.bind(localState)
      trace.add('subscribedState', localState)
      trace.add('bindReturned', bindings)
      bindMethodUsed = true
      if (getType(bindings) !== 'object') {
        error(
          'shadowbind_bind_method_return_type',
          'The bind method must return an object, but it returned ' +
            `"${getType(bindings)}"`
        )
      }
    } else {
      bindMethodUsed = false
      bindings = localState
    }

    bindComponent(component, bindings)
    trace.remove('bindReturned')
    trace.remove('subscribedState')
  }
  previousState = state
}
