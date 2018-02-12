import trace from './lib/trace.js'
import { components } from './define.js'
import applyState from './lib/applyState.js'

// Apply data-binding to all affected web components when the state changes
export default function publish (state) {
  trace.reset()
  trace.add('publishedState', state)

  for (const component of Object.values(components)) {
    const bindings = applyState({ state, component })
    if (bindings === false) continue
    component.publish(bindings)
  }

  trace.remove('publishedState', state)
}
