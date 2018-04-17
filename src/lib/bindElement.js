import walkElement from '../util/walkElement.js'
import parseAttribute, { priorityAttributes } from './parseAttribute.js'
import bindAttribute from './bindAttribute.js'
import trace from './trace.js'

export default function bindElement (component, element, bindings) {
  if (element.attributes.length === 0) return

  for (const priorityAttribute of priorityAttributes) {
    if (element.attributes[priorityAttribute]) {
      const attribute = element.attributes[priorityAttribute]
      tryApplyAttribute(component, element, bindings, attribute)
    }
  }

  walkElement(element, attribute => {
    if (priorityAttributes.includes(attribute)) return
    tryApplyAttribute(component, element, bindings, attribute)
  })
}

function tryApplyAttribute(component, element, bindings, attribute) {
  const parsedAttribute = parseAttribute(attribute)
  if (parsedAttribute) {
    trace.add('attribute', attribute)
    const { type, subtype, key } = parsedAttribute
    bindAttribute(component, element, bindings, type, subtype, key)
    trace.remove('attribute')
  }
}
