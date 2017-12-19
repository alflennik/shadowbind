import walkFragment from '../util/walkFragment.js'
import bindElement from './bindElement.js'
import trace from './trace.js'

export default function bindComponent (component, bindings) {
  walkFragment(component, element => {
    trace.add('element', element)
    bindElement(element, bindings)
  })
  trace.remove('element')
}
