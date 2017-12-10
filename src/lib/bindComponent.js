import { trace } from '../globals'
import * as repeaterState from '../lib/repeaterState'
import walkFragment from '../util/walkFragment'
import walkElement from '../util/walkElement'
import parseAttribute from './parseAttribute'
import bindElement from './bindElement'
import repeaterBind from './repeaterBind'
import initializeRepeat from './initializeRepeat'
import error from './error'

// Apply the state to the element's shadowDom
export default function bindComponent (component, bindings) {
  repeaterState.newBindings(bindings)

  walkFragment(component, bindings, (element, localBindings) => {
    let repeatId

    if (element.getAttribute(':for')) {
      const prependElement = element.nextSibling
      repeatId = initializeRepeat(element)

      return repeaterBind({
        component,
        repeatId,
        prependElement,
        bindings
      })
    }

    if (!component.shadowRoot) {
      try {
        component.attachShadow({ mode: 'open' })
      } catch (err) {
        trace = { component: trace.component }
        error(
          'shadowbind_closed_shadow_root',
          'Subscribed component has a closed shadowRoot, but only open ' +
            'shadowRoots are supported'
        )
      }
      trace = { component: trace.component }
      error(
        'shadowbind_no_shadow_root',
        'Subscribed web component has no shadowRoot. Be sure to call ' +
          "this.attachShadow({ mode: open }) in the component's constructor"
      )
    }

    walkElement(element, attribute => {
      const bindAction = parseAttribute(attribute)
      trace.element = element
      if (bindAction) bindElement(element, localBindings, bindAction)
    })
    delete trace.element
    delete trace.attribute
  })
}
