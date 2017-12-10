// eslint-disable-next-line
import { components, previousState, trace, bindMethodUsed } from './globals'
import error from './lib/error'
import applyStateKey from './lib/applyStateKey'
import getType from './util/getType'
import bindComponent from './lib/bindComponent'

// Apply data-binding to all affected web components when the state changes
export default function publish (state) {
  trace = {}
  trace.publishedState = state
  if (previousState !== null && state === previousState) return
  for (const subscribedComponent of components) {
    const { component, stateKey } = subscribedComponent
    trace.component = component
    if (
      previousState && stateKey && state[stateKey] === previousState[stateKey]
    ) continue
    let bindings
    const localState = applyStateKey(state, stateKey)
    trace.subscribedState = localState
    if (getType(component.bind) !== 'undefined') {
      bindings = component.bind(localState)
      trace.bindReturned = bindings
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
    delete trace.subscribedState
    delete trace.bindReturned
  }
  previousState = state
}
