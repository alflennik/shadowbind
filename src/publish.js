import trace from './lib/trace.js'
import deepClone from './util/deepClone.js'
import { components } from './define.js'
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

  for (const component of Object.values(components)) {
    component.sbPrivate.updateState()
  }

  queue.start()
  trace.remove('publishedState')
}
