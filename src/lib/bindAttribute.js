import trace from './trace.js'
import error from './error.js'
import assertType from './assertType.js'
import objectSearch from '../util/objectSearch.js'
import getType from '../util/getType.js'
import toCamelCase from '../util/toCamelCase.js'
import walkElement from '../util/walkElement.js'
import { replaceWithPlaceholder, putElementBack } from './bindIf.js'

export default function bindAttribute (
  component,
  element,
  bindings,
  type,
  subtype,
  key
) {
  if (type === 'on') {
    return bindEvent(component, element, bindings, subtype, key)
  }

  let value = key.indexOf('.') === -1
    ? bindings[key]
    : objectSearch(bindings, key)

  if (value == null) return

  trace.add('attributeState', value)
  const valueType = getType(value)

  if (
    (valueType === 'object' || valueType === 'array') &&
    (type === 'attr' || type === 'text' || type === 'html')
  ) {
    const bindSubnote = type === 'attr'
      ? ` or use prop:${subtype} to bind the data as a property instead of ` +
        'an attribute'
      : ''
    error(
      'shadowbind_binding_array_or_object',
      `Objects and arrays cannot be bound with "${type}" directly. Try ` +
        `calling JSON.stringify on the ${valueType} first${bindSubnote}.`
    )
  }

  switch (type) {
    case 'attr':
      if (value === true) {
        element.setAttribute(subtype, '')
      } else if (value != null && value !== false) {
        element.setAttribute(subtype, value)
      } else {
        element.removeAttribute(subtype)
      }
      break

    case 'prop':
      const camelCaseSubtype = toCamelCase(subtype)
      const methodType = getType(element[camelCaseSubtype])

      if (methodType !== 'function') {
        if (methodType === 'undefined') {
          error(
            'shadowbind_prop_undefined',
            `Cannot call prop "${camelCaseSubtype}" because it is undefined`
          )
        }
        error(
          'shadowbind_prop_type',
          `Prop "${camelCaseSubtype}" must be a function, but it is type ` +
            `${methodType}`
        )
      }

      element[camelCaseSubtype](value)
      break

    case 'text':
    case 'html':
      assertType(value, ['string', 'number'], `inner ${type} type`)
      type === 'text' ? element.innerText = value : element.innerHTML = value
      break

    case 'show':
      if (!value) element.style.display = 'none'
      else element.style.display = ''
      break

    case 'if':
      const placeholderId = element.getAttribute('sb:i')
      if (value) {
        if (!placeholderId) return
        putElementBack(element)
      } else {
        if (placeholderId) return
        replaceWithPlaceholder(element)
      }
      break

    case 'css':
      if (value != null) {
        element.style.setProperty(`--${subtype}`, value)
      } else {
        element.style.removeProperty(`--${subtype}`)
      }
      break

    case 'class':
      if (value) {
        element.classList.add(subtype)
      } else {
        element.classList.remove(subtype)
      }
      break

    case 'tag':
      const validTagName = (() => {
        if (valueType !== 'string') return false
        value = value.toLowerCase()
        return /^[a-z][a-z0-9_-]+$/.test(value)
      })()

      if (!validTagName) {
        error(
          'shadowbind_tag_name',
          `The value given for :tag must be a valid element name`
        )
      }

      if (element.tagName.toLowerCase() === value.toLowerCase()) return
      const replacement = document.createElement(value)
      replacement.innerHTML = element.innerHTML
      walkElement(element, attribute => {
        replacement.setAttribute(attribute.name, attribute.value)
      })

      const parent = element.parentNode
      const sibling = element.nextElementSibling
      parent.removeChild(element)
      parent.insertBefore(replacement, sibling)
      break

    case 'value':
      if (element.options && element.multiple) {
        for (const option of element.options) {
          if (value.includes(option.value)) option.selected = true
        }
      } else if (element.type === 'checkbox') {
        if (value === true) element.checked = true
        else if (value === false) element.checked = false
        else {
          if (value.includes(element.value)) element.checked = true
        }
      } else if (element.type === 'radio') {
        if (value === element.value) element.checked = true
      } else {
        element.value = value
      }
      break
  }

  trace.remove('attributeState')
}

function bindEvent (component, element, bindings, subtype, key) {
  if (component[key] === undefined) {
    error(
      'shadowbind_undefined_event_method',
      `Expected to find method "${key}" on your component to use as an event ` +
        `handler`
    )
  }
  assertType(component[key], 'function', 'event type')

  if (
    !(element.sbPrivate && element.sbPrivate.eventsAlreadyBound)
  ) {
    subtype.split(',').forEach(trigger => {
      element.addEventListener(trigger, event => {
        const shouldPropagate = component[key](event)
        if (shouldPropagate !== false) return
        event.preventDefault()
        event.stopPropagation()
      })
      if (!element.sbPrivate) element.sbPrivate = {}
      element.sbPrivate.eventsAlreadyBound = true
    })
  }
}
