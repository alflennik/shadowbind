import error from './error.js'
import applyDots from './applyDots.js'
import assertType from './assertType.js'

export default function applyState ({ state, component }) {
  const { subscriptions } = component.sbPrivate
  let bindings = {}

  for (const [bindKey, binders] of Object.entries(subscriptions)) {
    for (let i = binders.length - 1; i >= 0; i--) {
      const { source, watchKey, callback } = binders[i]

      const startValue = (() => {
        if (source === 'default') return
        if (source === 'state') return state[watchKey]
      })()

      const value = callback ? callback(startValue) : startValue

      bindings[bindKey] = value

      if (value !== undefined) break
    }
  }

  return bindings
}

export function applyStateKey (state, stateKey) {
  if (stateKey === undefined) return state

  assertType(stateKey, 'string', 'subscribe key type')

  if (!/^[^.].+[^.]$/.test(stateKey)) { // cannot begin or end with dot
    error(
      'shadowbind_subscribe_key_invalid',
      `The key "${stateKey}" could not be parsed`
    )
  }

  if (stateKey.indexOf('.') === -1) {
    if (!Object.keys(state).includes(stateKey)) {
      error(
        'shadowbind_subscribe_key_not_found',
        `The key "${stateKey}" could not be found in the published state`
      )
    }
  }

  return applyDots(
    state,
    stateKey,
    'state',
    'published state',
    'shadowbind_subscribe_key_not_found'
  )
}
