import bindRepeater from './bindRepeater.js'
import walkFragment from '../util/walkFragment.js'
import getType from '../util/getType.js'
import error from './error.js'
import bindElement from './bindElement.js'
import trace from './trace.js'

let bindMethodUsed
export { bindMethodUsed }

export default function bindComponent (component, subscribedState) {
  trace.add('subscribedState', subscribedState)
  trace.add('component', component)

  let bindings

  if (component.bind) {
    if (getType(component.bind) !== 'function') {
      error(
        'shadowbind_bind_property_type',
        'A bind property was set on the component, but it was ' +
          `"${getType(component.bind)}" instead of type "function"`
      )
    }

    bindings = component.bind(subscribedState)
    trace.add('bindReturned', bindings)
    bindMethodUsed = true
    if (getType(bindings) !== 'object') {
      error(
        'shadowbind_bind_method_return_type',
        'The bind method must return an object, but it returned ' +
          `"${getType(bindings)}"`
      )
    }
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
  trace.remove('component')
  trace.remove('subscribedState')
}
