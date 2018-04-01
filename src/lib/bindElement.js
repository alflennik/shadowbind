import walkElement from '../util/walkElement.js'
import parseAttribute from './parseAttribute.js'
import bindAttribute from './bindAttribute.js'
import trace from './trace.js'

export default function bindElement (component, element, bindings) {
  // Bind the tag first so events can be reattached after element is recreated
  const tagAttribute = element.attributes[':tag']
  if (tagAttribute) {
    trace.add('attribute', tagAttribute)
    bindTag(component, element, bindings)
    trace.remove('attribute')
    // If element has been removed, continue to next element, its replacement
    if (element.parentNode === null) return
  }

  walkElement(element, attribute => {
    trace.add('attribute', attribute)
    const parsedAttribute = parseAttribute(attribute)
    if (parsedAttribute) {
      const { type, subtype, key } = parsedAttribute
      bindAttribute(component, element, bindings, type, subtype, key)
    }
    trace.remove('attribute')
  })
}

function bindTag (component, element, bindings) {
  const { type, subtype, key } = parseAttribute(element.attributes[':tag'])
  bindAttribute(component, element, bindings, type, subtype, key)
}
