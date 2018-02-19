import getType from '../util/getType.js'
import error from './error.js'

export default function applyState ({ state, component }) {
  const { subscriptions } = component.sbPrivate
  let bindings = {}

  for (const [bindKey, binders] of Object.entries(subscriptions)) {
    for (let i = binders.length - 1; i >= 0; i--) {
      const { source, watchKey, callback } = binders[i]

      const startValue = (() => {
        if (source === 'default') return
        if (source === 'state') return applyStateKeyDots(state, watchKey)
      })()

      const value = callback ? callback(startValue) : startValue

      bindings[bindKey] = value

      if (value !== undefined) break
    }

    if (bindings[bindKey] === undefined) {
      error(
        'shadowbind_subscribe_key_not_found',
        `The subscribed key "${bindKey}" could not be determined and no ` +
          'default was provided'
      )
    }
  }

  return bindings
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
