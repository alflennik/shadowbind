import bindRepeater from './bindRepeater.js'
import walkFragment from '../util/walkFragment.js'
import assertType from './assertType.js'
import bindElement from './bindElement.js'
import trace from './trace.js'
import parseAttribute from './parseAttribute.js'
import bindAttribute from './bindAttribute.js'

let bindMethodUsed
export { bindMethodUsed }

export default function bindComponent (component, bindings) {
  trace.add('component', component)
  trace.add('subscribedState', bindings)

  if (component.bind) {
    assertType(component.bind, 'function', 'bind property type')

    bindings = component.bind(bindings)
    trace.add('bindReturned', bindings)
    bindMethodUsed = true

    assertType(bindings, 'object', 'bind method return type')
  } else {
    bindMethodUsed = false
  }

  walkFragment(component, element => {
    trace.add('element', element)
    // Bind the tag first so events can be reattached after element is recreated
    // and repeaters can run
    const tagAttribute = element.attributes[':tag']
    if (tagAttribute) {
      trace.add('attribute', tagAttribute)
      bindTag(component, element, bindings)
      trace.remove('attribute')
      // If element has been removed, continue to next element, its replacement
      if (element.parentNode === null) return
    }

    bindRepeater(element, bindings)
    if (!element.attributes[':publish']) {
      bindElement(component, element, bindings)
    }
    trace.remove('element')
  })

  trace.remove('bindReturned')
  trace.remove('subscribedState')
  trace.remove('component')
}

function bindTag (component, element, bindings) {
  const { type, subtype, key } = parseAttribute(element.attributes[':tag'])
  bindAttribute(component, element, bindings, type, subtype, key)
}
