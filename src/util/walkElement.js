import { trace } from '../globals.js'

// Run callback on every attribute of a dom element
export default function walkElement (element, callback) {
  for (const attribute of element.attributes) {
    if (!attribute.name) return
    trace.add('attribute', attribute)
    callback(attribute)
  }
  trace.remove('attribute')
}
