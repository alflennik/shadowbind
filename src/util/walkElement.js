// Run callback on every attribute of a dom element
export default function walkElement (element, callback) {
  for (const attribute of element.attributes) {
    if (!attribute.name) return
    callback(attribute)
  }
}
