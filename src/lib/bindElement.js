import walkElement from '../util/walkElement.js'
import parseAttribute from './parseAttribute.js'
import bindAttribute from './bindAttribute.js'
import trace from './trace.js'

export default function bindElement (element, bindings) {
  // Bind the tag first so events can be reattached after element is recreated
  const tagAttribute = element.attributes[':tag']
  if (tagAttribute) {
    trace.add('attribute', tagAttribute)
    bindTag(element, bindings)
    trace.remove('attribute')
    // If element has been removed, continue to next element, its replacement
    if (element.parentNode === null) return
  }

  walkElement(element, attribute => {
    trace.add('attribute', attribute)
    const parsedAttribute = parseAttribute(attribute)
    if (parsedAttribute) {
      bindAttribute(element, bindings, parsedAttribute)
    }
    trace.remove('attribute')
  })
}

function bindTag (element, bindings) {
  const parsedTag = parseAttribute(element.attributes[':tag'])
  bindAttribute(element, bindings, parsedTag)
}
