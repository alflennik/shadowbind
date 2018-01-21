import bindComponent from './lib/bindComponent.js'
import applyStateKey from './lib/applyStateKey.js'
import trace from './lib/trace.js'
import { previousState } from './publish.js'

export function refresh (component) {
  trace.reset()

  const stateKey = (() => {
    if (!component.sbPrivate) return null
    return component.sbPrivate.stateKey
  })()

  const subscribedState = applyStateKey(previousState, stateKey)

  trace.add('publishedState', previousState)
  bindComponent(component, subscribedState)
  trace.remove('publishedState')
}
