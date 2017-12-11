import trace from './trace.js'
import walkFragment from '../util/walkFragment.js'
import walkElement from '../util/walkElement.js'
import parseAttribute from './parseAttribute.js'
import bindElement from './bindElement.js'
import * as repeaterState from '../lib/repeaters/repeaterState.js'
import applyRepeater from './repeaters/apply.js'
import repeaterInitialize, { repeaters } from './repeaters/initialize.js'

// Apply the state to the element's shadowDom
export default function bindComponent (component, bindings) {
  repeaterState.newBindings(bindings)

  walkFragment(component, element => {
    if (element.getAttribute(':for')) {
      const prependElement = element.nextSibling
      const repeatId = repeaterInitialize(element)
      const repeater = repeaters[repeatId]
      repeaterState.startRepeater(repeater.as, repeater.loopKey)

      return applyRepeater({
        component,
        repeatId,
        prependElement,
        localBindings: repeaterState.current()
      })
    }

    walkElement(element, attribute => {
      const bindAction = parseAttribute(attribute)
      trace.add('element', element)
      if (bindAction) bindElement(element, repeaterState.current(), bindAction)
    })

    trace.remove('element')
    trace.remove('attribute')
  })
}
