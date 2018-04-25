import trace from './lib/trace.js'
import deepClone from './util/deepClone.js'
import * as connectedComponents from './lib/connectedComponents.js'
import * as queue from './lib/queue.js'

export let state
export let oldState

// Apply data-binding to all affected web components when the state changes
export default function publish (newState) {
  trace.reset()
  trace.add('publishedState', newState)
  queue.stop()

  oldState = state
  state = deepClone(newState)

  for (const component of connectedComponents.getAll()) {
    component.sbPrivate.updateState()
  }

  queue.start()
  trace.remove('publishedState')
}
