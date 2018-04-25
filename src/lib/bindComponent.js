import bindRepeater from './bindRepeater.js'
import walkFragment from '../util/walkFragment.js'
import assertType from './assertType.js'
import bindElement from './bindElement.js'
import trace from './trace.js'
import parseAttribute from './parseAttribute.js'
import bindAttribute from './bindAttribute.js'

export default function bindComponent (component, bindings) {
  trace.add('component', component)
  trace.add('subscribedState', bindings)

  if (component.beforeBindCallback) component.beforeBindCallback()

  if (component.bindings) {
    assertType(component.bindings, 'function', 'bindings property type')

    bindings = component.bindings(bindings)
    trace.add('bindReturned', bindings)

    assertType(bindings, 'object', 'bindings method return type')
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
    if (!element.attributes[':map']) {
      bindElement(component, element, bindings)
    }
    trace.remove('element')
  })

  if (component.afterBindCallback) component.afterBindCallback()

  trace.remove('bindReturned')
  trace.remove('subscribedState')
  trace.remove('component')
}

function bindTag (component, element, bindings) {
  const { type, subtype, key } = parseAttribute(element.attributes[':tag'])
  bindAttribute(component, element, bindings, type, subtype, key)
}
