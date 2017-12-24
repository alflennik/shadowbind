import getType from '../util/getType.js'
import error from './error.js'
import bindComponent from './bindComponent.js'

let emptyExamples = {}
let placeholderId = 0

export default function bindRepeater (element, key, value) {
  const emptyRepeaterId = getEmptyRepeaterId(element)
  if (!firstElementInRepeat(element) && !emptyRepeaterId) return

  if (getType(value) !== 'array') {
    error(
      'shadowbind_for_type',
      `"${key}" must be an array when using ":for", but it was ` +
        `"${getType(value)}"`
    )
  }

  const elements = emptyRepeaterId ? [] : currentRepeaterElements(element)
  const currentCount = elements.length
  const expectedCount = value.length

  if (currentCount < expectedCount) {
    const example = (() => {
      if (emptyRepeaterId) return emptyExamples[emptyRepeaterId]
      return element
    })()

    const prependElement = element.nextElementSibling
    const count = expectedCount - currentCount

    createElements(example, prependElement, element.parentNode, count)
  } else if (currentCount > expectedCount) {
    removeElements(elements, element.parentNode, expectedCount - currentCount)
  }

  if (expectedCount > 0 && !element.shadowRoot) {
    error(
      'shadowbind_for_without_shadow_root',
      `":for" must be used on an element with a shadowRoot`
    )
  }

  for (let i = 0; i < expectedCount; i++) {
    let newBindings = value[i]
    if (element.bind) newBindings = element.bind(value[i])
    bindComponent(element, newBindings)
    element = element.nextElementSibling
  }
}

function firstElementInRepeat (element) {
  const partOfRepeat = PartOfRepeat(element)
  return !partOfRepeat(element.previousElementSibling)
}

function PartOfRepeat (element) {
  const elementKey = element.getAttribute(':for')
  return compare => {
    const key = compare.getAttribute(':for')
    return elementKey === key
  }
}

function currentRepeaterElements (element) {
  const partOfRepeat = PartOfRepeat(element)
  let elements = []
  let deadManSwitch = 0
  do {
    deadManSwitch++
    elements.push(element)
    element = element.nextElementSibling
  } while (partOfRepeat(element) || deadManSwitch === 500)

  return elements
}

function getEmptyRepeaterId (element) {
  return element.getAttribute('sb:r')
}

function createElements (example, prependElement, parent, count) {
  for (let i = 0; i < count; i++) {
    const newElement = example.cloneNode(true)
    parent.insertBefore(newElement, prependElement)
  }
}

function removeElements (elements, parent, count) {
  if (elements.length === count) {
    const placeholder = generatePlaceholder()
    emptyExamples[placeholderId] = elements[0].cloneNode(true)
    const prependElement = elements[elements.length - 1].nextElementSibling
    parent.insertBefore(placeholder, prependElement)
  }
  const toRemove = elements.slice(-count)
  toRemove.forEach(element => parent.removeChild(element))
}

function generatePlaceholder () {
  placeholderId++
  const placeholder = document.createElement('span')
  placeholder.setAttribute('sb:r', placeholderId)
  return placeholder
}
