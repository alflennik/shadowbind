import trace from './lib/trace.js'
import { components } from './define.js'
import queueChanges from './lib/queueChanges.js'

let state
export { state }

// Apply data-binding to all affected web components when the state changes
export default function publish (newState) {
  state = newState
  trace.reset()
  trace.add('publishedState', state)

  for (const component of Object.values(components)) {
    queueChanges(component)
  }

  trace.remove('publishedState', state)
}
