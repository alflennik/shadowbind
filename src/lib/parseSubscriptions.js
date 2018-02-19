import getType from '../util/getType.js'

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
  }

  return { subscriptions, observedAttrs, observedProps, observedState }
}

function addBinding ({ bindKey, source, watchKey, callback }) {
  if (watchKey) {
    if (source === 'state') observedState.push(watchKey)
    if (source === 'attr') observedAttrs.push(watchKey)
    if (source === 'prop') observedProps.push(watchKey)
  }
  subscriptions[bindKey].push({ source, watchKey, callback })
}

function addBindingFromObject (bindKey, obj) {
  const source = (() => {
    if (obj.state) return 'state'
    if (obj.prop) return 'prop'
    if (obj.attr) return 'attr'
    if (obj.default) return 'default'
  })()

  if (source === 'default') {
    const isFunction = getType(obj.default) === 'function'
    const callback = isFunction ? obj.default : () => obj.default
    return addBinding({ bindKey, source, watchKey: false, callback })
  }

  addBinding({ bindKey, source, watchKey: obj[source], callback: obj.callback })
}

function addBindingFromString (bindKey, str) {
  addBinding({ bindKey, source: str, watchKey: bindKey, callback: undefined })
}
