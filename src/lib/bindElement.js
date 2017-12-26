import walkElement from '../util/walkElement.js'
import parseAttribute from './parseAttribute.js'
import bindAttribute from './bindAttribute.js'
import trace from './trace.js'

export default function bindElement (element, bindings) {
  walkElement(element, attribute => {
    trace.add('attribute', attribute)
    const parsedAttribute = parseAttribute(attribute)
    if (parsedAttribute) {
      bindAttribute(element, bindings, parsedAttribute)
    }
    trace.remove('attribute')
  })
}
