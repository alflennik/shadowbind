import walkElement from '../util/walkElement.js'
import parseAttribute from './parseAttribute.js'
import bindAttribute from './bindAttribute.js'
import trace from './trace.js'
import * as repeaterState from './repeaters/repeaterState.js'

export default function bindElement (element) {
  walkElement(element, attribute => {
    trace.add('attribute', attribute)
    const parsedAttribute = parseAttribute(attribute)
    if (parsedAttribute) {
      bindAttribute(element, repeaterState.current(), parsedAttribute)
    }
  })

  trace.remove('attribute')
}
