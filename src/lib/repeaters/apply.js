import { repeaters } from './initialize.js'
import { setId, nextId } from './setId.js'
import { el, elAll } from '../../util/selectors.js'

// Create, move, remove and modify a repeater
export default function applyRepeater ({
  component,
  repeatId,
  prependElement,
  localBindings
} = {}) {
  nextId()
  const { loopKey, uniqueId, parent, example } = repeaters[repeatId]
  let currentItems

  if (repeatId) {
    currentItems = elAll(`[${repeatId}]`, parent).reduce((acc, el) => {
      return acc.concat(el.getAttribute('key'))
    }, [])
  } else {
    currentItems = []
  }

  for (const item of localBindings[loopKey]) {
    let element

    if (currentItems.includes(item[uniqueId] + '')) {
      element = component.shadowRoot.querySelector(
        `[key="${item[uniqueId]}"][${repeatId}]`
      )
    } else {
      element = example.cloneNode(true)
    }

    parent.insertBefore(element, prependElement)
    element.setAttribute('key', item[uniqueId])
    setId(element)
  }

  const newRepeatId = setId(example)

  if (repeatId) {
    elAll(`[${repeatId}]`, component.shadowRoot)
      .map(item => parent.removeChild(item))
  }

  if (elAll(`[${newRepeatId}]`, component.shadowRoot).length === 0) {
    let placeholder = document.createElement('span')
    placeholder.setAttribute('sb:repeat', '')
    setId(placeholder)
    parent.insertBefore(placeholder, prependElement)
  }

  repeaters[newRepeatId] = repeaters[repeatId]
  delete repeaters[repeatId]
  return newRepeatId
}
