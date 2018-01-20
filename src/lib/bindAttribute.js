import bindComponent, { bindMethodUsed } from './bindComponent.js'
import trace from './trace.js'
import error from './error.js'
import applyDots from './applyDots.js'
import getType from '../util/getType.js'
import toCamelCase from '../util/toCamelCase.js'
import walkElement from '../util/walkElement.js'
import { replaceElement, replacePlaceholder } from './bindIf.js'

export default function bindAttribute (
  element,
  localBindings,
  { type, subtype, key } = {}
) {
  let value

  if (key.indexOf('.') === -1) {
    if (!Object.keys(localBindings).includes(key)) {
      const searchSource = trace.get().bindReturned
        ? 'the object returned by bind()'
        : 'the subscribed state'

      error(
        'shadowbind_key_not_found',
        `The key "${key}" could not be found in ${searchSource}`
      )
    }

    value = localBindings[key]
  } else {
    value = applyDots(
      localBindings,
      key,
      bindMethodUsed ? 'localState' : 'subscribedState',
      bindMethodUsed ? 'local state' : 'subscribed state',
      'shadowbind_key_not_found'
    )
  }

  trace.add('attributeState', value)
  const valueType = getType(value)

  if (
    (valueType === 'object' || valueType === 'array') &&
    (type === 'bind' || type === 'text' || type === 'html')
  ) {
    const bindSubnote = type === 'bind'
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
    case 'bind':
      if (value !== null) element.setAttribute(subtype, value)
      else element.removeAttribute(subtype)
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
      if (!['string', 'number', 'null'].includes(valueType)) {
        error(
          'shadowbind_inner_content_type',
          `"${key}" must be a string or number (or null) when binding to ` +
            `inner ${type}, but it was "${valueType}"`
        )
      }

      if (value != null) {
        type === 'text' ? element.innerText = value : element.innerHTML = value
      }
      break

    case 'on':
      if (valueType !== 'function') {
        error(
          'shadowbind_event_type',
          `"${key}" must be a function, but it was "${valueType}"`
        )
      }

      if (
        !(element.sbPrivate && element.sbPrivate.eventsAlreadyBound)
      ) {
        subtype.split(',').forEach(trigger => {
          element.addEventListener(trigger, event => {
            const shouldPropagate = value(event)
            if (shouldPropagate) return
            event.preventDefault()
            event.stopPropagation()
          })
          if (!element.sbPrivate) element.sbPrivate = {}
          element.sbPrivate.eventsAlreadyBound = true
        })
      }
      break

    case 'show':
      if (!value) element.style.display = 'none'
      else element.style.display = ''
      break

    case 'if':
      const placeholderId = element.getAttribute('sb:i')
      if (value) {
        if (!placeholderId) return
        replaceElement(element)
      } else {
        if (placeholderId) return
        replacePlaceholder(element)
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

    case 'publish':
      bindComponent(element, value)
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
  }

  trace.remove('attributeState')
}
