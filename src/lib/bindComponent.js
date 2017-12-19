import repeaterBind from './repeaters/bindElement.js'
import * as repeaterState from './repeaters/repeaterState.js'
import walkFragment from '../util/walkFragment.js'
import bindElement from '../util/bindElement.js'
import trace from './trace.js'

let bindNextElement

export default function bindComponent (component, bindings) {
  repeaterState.newBindings(bindings)

  walkFragment(component, element => {
    trace.add('element', element)
    // Apply repeaters one element in advance
    const nextElement = element.nextElementSibling
    const doNotBind = nextElement
      ? repeaterBind(component, nextElement).doNotBind
      : false

    if (bindNextElement) bindElement(element)
    bindNextElement = !doNotBind
  })

  trace.remove('element')
}
