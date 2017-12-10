import { trace } from '../globals'

// Run callback on every attribute of a dom element
export default function walkElement (element, callback) {
  for (const attribute of element.attributes) {
    if (!attribute.name) return
    trace.attribute = attribute
    callback(attribute)
  }
  delete trace.attribute
}
