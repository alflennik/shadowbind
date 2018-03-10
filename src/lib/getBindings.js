import getType from '../util/getType.js'
import error from './error.js'

export default function getBindings (component, { state, direct }) {
  const { subscriptions } = component.sbPrivate
  let bindings = {}

  for (const [bindKey, binders] of Object.entries(subscriptions)) {
    for (const { source, watchKey, callback } of binders) {
      const startValue = (() => {
        if (source === 'attr') return component.getAttribute(watchKey)
        if (source === 'state') return applyStateKeyDots(state, watchKey)
      })()

      const value = callback ? callback(startValue) : startValue
      bindings[bindKey] = value
      if (value !== undefined) break
    }
  }

  return Object.assign(bindings, direct)
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
