import { trace, events } from '../globals.js'
import { bindMethodUsed } from '../publish.js'
import error from './error.js'
import applyDots from './applyDots.js'
import getType from '../util/getType.js'
import { getDomKey, setDomKey } from './domKey.js'

// Apply data-binding to a particular element
export default function bindElement (element, localBindings, parsedAttribute) {
  const { type, param, key } = parsedAttribute
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
  let valueType = getType(value)

  if (
    (valueType === 'object' || valueType === 'array') &&
    (type === 'bind' || type === 'text' || type === 'html')
  ) {
    const bindSubnote = type === 'bind'
      ? ` or use prop:${param} to bind the data as a property instead of an ` +
        'attribute'
      : ''
    error(
      'shadowbind_binding_array_or_object',
      `Objects and arrays cannot be bound with "${type}" directly. Try ` +
        `calling JSON.stringify on the ${valueType} first${bindSubnote}.`
    )
  }

  switch (type) {
    case 'bind':
      if (value !== null) element.setAttribute(param, value)
      else element.removeAttribute(param)
      break

    case 'prop':
      throw new Error('not implemented')

    case 'text':
    case 'html':
      if (!(getType(value) === 'string' || getType(value) === 'null')) {
        error(
          'shadowbind_inner_content_type',
          `"${key}" must be a string (or null) when binding to inner ` +
            `${type}, but it was "${getType(value)}"`
        )
      }

      if (value != null) {
        type === 'text' ? element.innerText = value : element.innerHTML = value
      }
      break

    case 'on':
      if (getType(value) !== 'function') {
        error(
          'shadowbind_event_type',
          `"${key}" must be a function, but it was "${getType(value)}"`
        )
      }

      let domKey = getDomKey(element)
      if (!domKey) domKey = setDomKey(element)
      if (!events[domKey]) events[domKey] = {}
      if (!events[domKey][param] && events[domKey][param] !== key) {
        element.addEventListener(param, value)
        events[domKey][param] = key
      }
      break

    case 'show':
      if (!value) element.style.display = 'none'
      else element.style.display = ''
      break

    case 'css':
      if (getType(value) !== 'object') {
        error(
          'shadowbind_css_type',
          `"${key}" must be an object when binding to css, but it was ` +
            `"${getType(value)}"`
        )
      }

      for (const cssProp of Object.keys(value)) {
        trace.add('cssProp', cssProp)
        error(
          'shadowbind_css_prop_type',
          `"${cssProp}" must be a string, but it was ` +
            `"${getType(value[cssProp])}"`
        )
        element.style.setProperty(`--${cssProp}`, value[cssProp])
      }

      trace.remove('cssProp')
      break
  }
}
