import { trace } from '../globals.js'
import * as repeaterState from '../lib/repeaterState.js'
import walkFragment from '../util/walkFragment.js'
import walkElement from '../util/walkElement.js'
import parseAttribute from './parseAttribute.js'
import bindElement from './bindElement.js'
import repeaterBind from './repeaterBind.js'
import repeaterInitialize from './repeaterInitialize.js'

// Apply the state to the element's shadowDom
export default function bindComponent (component, bindings) {
  repeaterState.newBindings(bindings)

  walkFragment(component, element => {
    let repeatId

    if (element.getAttribute(':for')) {
      const prependElement = element.nextSibling
      repeatId = repeaterInitialize(element)

      return repeaterBind({
        component,
        repeatId,
        prependElement,
        bindings
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
