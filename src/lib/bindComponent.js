import bindRepeater from './bindRepeater.js'
import walkFragment from '../util/walkFragment.js'
import assertType from './assertType.js'
import bindElement from './bindElement.js'
import trace from './trace.js'

let bindMethodUsed
export { bindMethodUsed }

export default function bindComponent (component, subscribedState) {
  trace.add('component', component)
  trace.add('subscribedState', subscribedState)
  trace.add('component', component)

  let bindings

  if (component.bind) {
    assertType(component.bind, 'function', 'bind property type')

    bindings = component.bind(subscribedState)
    trace.add('bindReturned', bindings)
    bindMethodUsed = true

    assertType(bindings, 'object', 'bind method return type')
  } else {
    bindMethodUsed = false
    bindings = subscribedState
  }

  walkFragment(component, element => {
    trace.add('element', element)
    bindRepeater(element, bindings)
    bindElement(element, bindings)
    trace.remove('element')
  })

  trace.remove('bindReturned')
  trace.remove('subscribedState')
  trace.remove('component')
}
