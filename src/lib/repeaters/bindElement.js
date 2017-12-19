import initialize, { repeaters } from './initialize'
import * as repeaterState from './repeaterState'

// Called on every element. Used to register, reorder and expand new repeaters,
// and track their influence on the local state. Does not data-bind.
export default function bindElement(component, element) {
  let shouldSavePreviousId
  let shouldExpandAndReorder

  const isNew = element.getAttribute(':for')
  let id = element.getAttribute('sb:r')
  const previousElement = element.previousElementSibling
  const previousId = previousElement.getAttribute('sb:r')

  checkForEndOfRepeater(previousId, id)

  if (!isNew && !id) {
    // vanilla element
    return { doNotBind: false }
  }

  const parent = element.parentElement
  const prependElement = element.nextElementSibling

  if (isNew) {
    // a new repeater
    id = initialize(element)
    repeaterState.start(repeaters[id].as, repeaters[id].loopKey)

    return { doNotBind: true }
  } else if (id && previousId !== id) {
    // first element in repeater
    repeaterState.start(repeaters[id].as, repeaters[id].loopKey)

    expandAndReorder({
      component,
      element,
      repeaterId: id,
      prependElement,
      parent
    })

    return { doNotBind: false } // what if reording happens?
  } else if (id && previousId === id) {
    repeaterState.incrementRepeater()
    return { doNotBind: false }
  }

  if (id === previousId) { // another instance of current repeater
    repeaterState.incrementRepeater()
    shouldExpandAndReorder = true
  }

  if (id !== previousId) { // first instance of an expanded repeater
    if (previousId) repeaterState.endRepeater()
    repeaterState.start(repeaters[id].as, repeaters[id].loopKey)
  }

  if (shouldExpandAndReorder) {

  }
}

function checkForEndOfRepeater(previousId, id) {
  if (previousId && !id) repeaterState.endRepeater()
}






// Apply the state to the element's shadowDom
export default function bindElement (component, element) {
  repeaterState.newBindings(bindings)

  walkFragment(component, element => {
    if (element.getAttribute(':for')) {
      return repeaterInitialize(element)
    } else {
      trackRepeaters(component, element)
    }

    trace.add('element', element)


    trace.remove('element')
  })
}

function trackRepeaters (component, element) {
  const repeatId = (() => {
    for (let attr of element.attributes) {
      const matches = /^(r\d+)$/.exec(attr.name)
      if (matches) return matches[1]
    }
  })()

  if (
    !repeatId &&
    currentRepeater &&
    element.previousElementSibling &&
    element.previousElementSibling.getAttribute(currentRepeater) !== null
  ) {
    currentRepeater = null
    repeaterState.endRepeater()
    return
  }

  if (!repeatId) return

  if (repeatId === currentRepeater) {
    repeaterState.incrementRepeater()
    return
  }

  const repeater = repeaters[repeatId]
  if (currentRepeater) repeaterState.endRepeater()
  repeaterState.startRepeater(repeater.as, repeater.loopKey)

  currentRepeater = applyRepeater({
    component,
    repeatId,
    prependElement: element.nextSibling,
    localBindings: repeaterState.current()
  })
}
