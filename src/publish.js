import trace from './lib/trace.js'
import { components } from './subscribe.js'
import applyStateKey from './lib/applyStateKey.js'
import bindComponent from './lib/bindComponent.js'

let previousState = null

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

    const subscribedState = applyStateKey(state, stateKey)

    bindComponent(component, subscribedState)
  }
  previousState = state
}
