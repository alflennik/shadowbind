import bindComponent, { bindMethodUsed } from './bindComponent.js'
import trace from './trace.js'
import error from './error.js'
import assertType from './assertType.js'
import applyDots from './applyDots.js'
import getType from '../util/getType.js'
import toCamelCase from '../util/toCamelCase.js'
import { getDomKey, setDomKey } from './domKey.js'

let events = {}

export default function bindAttribute (
  element,
  localBindings,
  { type, param, key } = {}
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
      const camelCaseParam = toCamelCase(param)
      const methodType = getType(element[camelCaseParam])

      if (methodType !== 'function') {
        if (methodType === 'undefined') {
          error(
            'shadowbind_prop_undefined',
            `Cannot call prop "${camelCaseParam}" because it is undefined`
          )
        }
        error(
          'shadowbind_prop_type',
          `Prop "${camelCaseParam}" must be a function, but it is type ` +
            `${methodType}`
        )
      }

      element[camelCaseParam](value)
      break

    case 'text':
    case 'html':
      assertType(value, ['string', 'number', 'null'], 'inner content type')

      if (value != null) {
        type === 'text' ? element.innerText = value : element.innerHTML = value
      }
      break

    case 'on':
      assertType(value, 'function', 'event type')

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
      assertType(value, 'object', 'css type')

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

    case 'publish':
      bindComponent(element, value)
      break
  }

  trace.remove('attributeState')
}
