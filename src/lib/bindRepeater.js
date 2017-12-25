import getType from '../util/getType.js'
import error from './error.js'
import bindComponent from './bindComponent.js'

let emptyExamples = {}
let placeholderId = 0

export default function bindRepeater (element, bindings) {
  const emptyRepeaterId = getEmptyRepeaterId(element)
  if (!firstElementInRepeat(element) && !emptyRepeaterId) return

  const { key, value } = loadKeyValue(element, emptyRepeaterId, bindings)

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
    const count = expectedCount - currentCount
    element = createElements(element, elements, emptyRepeaterId, count)
  } else if (currentCount > expectedCount) {
    removeElements(elements, element.parentNode, currentCount - expectedCount)
  }

  if (expectedCount === 0) return

  if (!element.shadowRoot) {
    error(
      'shadowbind_for_without_shadow_root',
      `":for" must be used on an element with a shadowRoot`
    )
  }

  for (let i = 0; i < expectedCount; i++) {
    let newBindings = value[i]
    if (element.bind) {
      if (getType(element.bind) !== 'function') {
        error(
          'shadowbind_for_bind_type',
          'The component bind method was defined as ' +
            `"${getType(element.bind)}" but it must be a function`
        )
      }
      newBindings = element.bind(value[i])
    }
    bindComponent(element, newBindings)
    element = element.nextElementSibling
  }
}

function firstElementInRepeat (element) {
  if (!element.getAttribute(':for')) return false
  const partOfRepeat = PartOfRepeat(element)
  if (element.previousElementSibling === null) return true
  return !partOfRepeat(element.previousElementSibling)
}

function PartOfRepeat (element) {
  const elementKey = element.getAttribute(':for')
  return compare => {
    if (compare === null) return false
    const key = compare.getAttribute(':for')
    return elementKey === key
  }
}

function loadKeyValue (element, emptyRepeaterId, bindings) {
  const key = (() => {
    if (!emptyRepeaterId) return element.getAttribute(':for')
    return emptyExamples[emptyRepeaterId].getAttribute(':for')
  })()
  const value = bindings[key]
  return { key, value }
}

function currentRepeaterElements (element) {
  const partOfRepeat = PartOfRepeat(element)
  let elements = []
  do {
    elements.push(element)
    element = element.nextElementSibling
  } while (partOfRepeat(element))

  return elements
}

function getEmptyRepeaterId (element) {
  return element.getAttribute('sb:r')
}

function createElements (element, elements, emptyRepeaterId, count) {
  const example = (() => {
    if (emptyRepeaterId) return emptyExamples[emptyRepeaterId]
    return element
  })()

  const prependElement = (() => {
    if (emptyRepeaterId) return element.nextElementSibling
    return elements[elements.length - 1].nextElementSibling
  })()

  const previousElement = element.previousElementSibling
  const parent = element.parentNode

  for (let i = 0; i < count; i++) {
    const newElement = example.cloneNode(true)
    parent.insertBefore(newElement, prependElement)
  }

  if (emptyRepeaterId) {
    parent.removeChild(element)
    if (!previousElement) return parent.firstElementChild
    return previousElement.nextElementSibling
  }
  return element
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
