import trace from './lib/trace.js'
import getType from './util/getType.js'
import error from './lib/error.js'
import { components } from './define.js'
import queueChanges from './lib/queueChanges.js'

let state
export { state }

// Apply data-binding to all affected web components when the state changes
export default function publish (newState) {
  trace.reset()
  trace.add('publishedState', newState)

  for (const component of Object.values(components)) {
    let changedState = {}
    const observedState = component.sbPrivate.observedState
    for (const watchKey of observedState) {
      const oldValue = applyStateKeyDots(state, watchKey)
      const newValue = applyStateKeyDots(newState, watchKey)
      if (newValue !== oldValue /* TODO: doesn't work with objects */) {
        changedState[watchKey] = newValue
      }
    }
    if (Object.keys(changedState).length) {
      queueChanges(component, { state: changedState })
    }
  }

  trace.remove('publishedState')
  state = newState
}

export function applyStateKeyDots (state, watchKey) {
  if (getType(state) !== 'object') return

  if (!/^[^.].+[^.]$/.test(watchKey)) { // cannot begin or end with dot
    error(
      'shadowbind_subscribe_key_invalid',
      `The key "${watchKey}" could not be parsed`
    )
  }

  let search = state

  for (const keyPart of watchKey.split('.')) {
    if (search[keyPart] === undefined) return
    search = search[keyPart]
  }

  return search
}
