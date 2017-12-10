// Run callback on every element in the shadowDom, applying repeaters as needed
export default function walkFragment (component, bindings, callback) {
  function recursiveWalk (node) {
    if (node.nodeType === 1) callback(node)
    node = node.firstChild
    while (node) {
      recursiveWalk(node)
      node = node.nextSibling
    }
  }

  recursiveWalk(component.shadowRoot)
}
