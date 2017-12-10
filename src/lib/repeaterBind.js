import { repeaters, repeaterCount } from '../globals.js' // eslint-disable-line
import { el, elAll } from '../util/selectors.js'
import repeaterId from './repeaterId.js'

// Create, move, remove, modify and databind a repeater
export default function repeaterBind ({
  component,
  repeatId,
  prependElement,
  repeaterState,
  bindings,
  callback
} = {}) {
  repeaterCount++
  const { loopKey, uniqueId, parent, example } = repeaters[repeatId]
  let currentItems

  if (repeatId) {
    currentItems = elAll(`[${repeatId}]`, parent).reduce((acc, el) => {
      return acc.concat(el.getAttribute('key'))
    }, [])
  } else {
    currentItems = []
  }

  repeaterState.startRepeater(bindings[loopKey])
  console.log(bindings)
  for (const item of repeaterState.current()[loopKey]) {
    let element

    if (currentItems.includes(item[uniqueId] + '')) {
      element = el(`[key="${item[uniqueId]}"][${repeatId}]`)
    } else {
      element = example.cloneNode(true)
    }

    parent.insertBefore(element, prependElement)
    element.setAttribute('key', item[uniqueId])
    repeaterId(element)
    callback(element, repeaterState.current())
    repeaterState.incrementRepeater()
  }
  repeaterState.endRepeater()

  const newRepeatId = repeaterId(example)

  if (repeatId) {
    elAll(`[${repeatId}]`, component.shadowRoot)
      .map(item => parent.removeChild(item))
  }

  if (elAll(`[${newRepeatId}]`, component.shadowRoot).length === 0) {
    let placeholder = document.createElement('span')
    placeholder.setAttribute('sb:repeat', '')
    repeaterId(placeholder)
    parent.insertBefore(placeholder, prependElement)
  }

  repeaters[newRepeatId] = repeaters[repeatId]
  delete repeaters[repeatId]
}
