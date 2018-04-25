import getType from '../util/getType.js'
import error from './error.js'
import assertType from './assertType.js'

let subscriptions
let observedAttrs
let observedProps
let observedState

export default function parseSubscriptions (subscriptionObject) {
  subscriptions = {}
  observedAttrs = []
  observedProps = []
  observedState = []

  for (const [bindKey, value] of Object.entries(subscriptionObject)) {
    subscriptions[bindKey] = []

    switch (getType(value)) {
      case 'string':
        addBindingFromString(bindKey, value)
        continue

      case 'object':
        addBindingFromObject(bindKey, value)
        continue

      case 'array':
        for (const binder of value) {
          const valueType = getType(binder)
          if (valueType === 'string') addBindingFromString(bindKey, binder)
          if (valueType === 'object') addBindingFromObject(bindKey, binder)
        }
        continue
    }

    failureToParse()
  }

  return { subscriptions, observedAttrs, observedProps, observedState }
}

function addBinding ({ bindKey, source, watchKey, callback }) {
  if (watchKey) {
    if (source === 'state') observedState.push(watchKey)
    else if (source === 'attr') observedAttrs.push(watchKey)
    else if (source === 'prop') observedProps.push(watchKey)
    else failureToParse()
  }
  assertType(callback, ['function', 'undefined'], 'subscribe callback')
  assertType(watchKey, ['string'], 'subscribe watch key')
  subscriptions[bindKey].push({ source, watchKey, callback })
}

function addBindingFromObject (bindKey, obj) {
  const source = (() => {
    if (obj.state) return 'state'
    if (obj.prop) return 'prop'
    if (obj.attr) return 'attr'
  })()

  if (!/^[^.].+[^.]$/.test(obj[source])) failureToParse()

  addBinding({ bindKey, source, watchKey: obj[source], callback: obj.callback })
}

function addBindingFromString (bindKey, str) {
  addBinding({ bindKey, source: str, watchKey: bindKey, callback: undefined })
}

function failureToParse () {
  error(
    'shadowbind_invalid_subscribe',
    'Your subscribe() response is invalid'
  )
}
