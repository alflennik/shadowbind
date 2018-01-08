import trace from '../lib/trace.js'
import error from '../lib/error.js'

// Run callback on every element in the shadowDom, applying repeaters as needed
export default function walkFragment (component, callback) {
  let previousNode

  function recursiveWalk (node) {
    const wasAttachedToDom = node.parentNode
    const nodeIsAnElement = node.nodeType === 1
    if (nodeIsAnElement) callback(node)
    const stillAttachedAfterCallback = node.parentNode

    if (wasAttachedToDom && !stillAttachedAfterCallback) {
      // Some elements get removed by the callback, which would mess up the walk
      return true
    }

    previousNode = node
    node = node.firstChild

    while (node) {
      const wasJustRemovedFromDom = recursiveWalk(node)

      if (wasJustRemovedFromDom) {
        node = previousNode
      } else {
        previousNode = node
        node = node.nextSibling
      }
    }
  }

  if (!component.shadowRoot) shadowRootError(component)
  recursiveWalk(component.shadowRoot)
}

function shadowRootError (component) {
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
