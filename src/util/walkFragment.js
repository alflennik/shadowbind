import trace from '../lib/trace.js'
import error from '../lib/error.js'

// Run callback on every element in the shadowDom, applying repeaters as needed
export default function walkFragment (component, callback) {
  function recursiveWalk (node) {
    if (node.nodeType === 1) callback(node)
    node = node.firstChild
    while (node) {
      recursiveWalk(node)
      node = node.nextSibling
    }
  }

  if (!component.shadowRoot) {
    try {
      component.attachShadow({ mode: 'open' })
    } catch (err) {
      trace.set({ component: trace.get().component })
      error(
        'shadowbind_closed_shadow_root',
        'Subscribed component has a closed shadowRoot, but only open ' +
          'shadowRoots are supported'
      )
    }
    trace.set({ component: trace.get().component })
    error(
      'shadowbind_no_shadow_root',
      'Subscribed web component has no shadowRoot. Be sure to call ' +
        "this.attachShadow({ mode: open }) in the component's constructor"
    )
  }

  recursiveWalk(component.shadowRoot)
}
