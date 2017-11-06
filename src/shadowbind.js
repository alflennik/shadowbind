let components = []
let events = {}
let previousState = null
let repeaterCount = 0
let repeaters = {}
// let currentRepeaters = []
let trace
let bindMethodUsed

// Track subscribed web components
export function subscribe (component, stateKey) {
  trace = {}
  if (!arguments.length) {
    shadowError(
      'shadowbind_subscribe_without_arguments',
      'The first argument of subscribe() should be a web component, but no ' +
        'arguments were given. Call subscribe(this) in the constructor ' +
        'method of a web component',
      'https://stackoverflow.com/questions/7505623/colors-in-javascript-console'
    )
  }

  if (component && !component.classList) { // is dom element eslint-disable-line
    shadowError(
      'shadowbind_subscribe_type',
      'The first argument of subscribe() should be a web component, not ' +
        `${typeof component}. Call subscribe(this) in the constructor method ` +
        'of a web component'
    )
  }
  components.push({ component, stateKey })
}

// Apply data-binding to all affected web components when the state changes
export function publish (state) {
  trace = {}
  trace.publishedState = state
  if (previousState !== null && state === previousState) return
  for (const subscribedComponent of components) {
    const { component, stateKey } = subscribedComponent
    trace.component = component
    if (
      previousState && stateKey && state[stateKey] === previousState[stateKey]
    ) continue
    let bindings
    const localState = applyStateKey(state, stateKey)
    trace.subscribedState = localState
    if (typeof component.bind !== 'undefined') {
      bindings = component.bind(localState)
      trace.bindReturned = bindings
      bindMethodUsed = true
      if (typeof bindings !== 'object') {
        shadowError(
          'shadowbind_bind_method_return_type',
          'The bind method must return an object, but it returned ' +
            `"${typeof bindings}"`
        )
      }
    } else {
      bindMethodUsed = false
      bindings = localState
    }
    bindComponent(component, bindings)
    delete trace.subscribedState
    delete trace.bindReturned
  }
  previousState = state
}

function applyStateKey (state, stateKey) {
  if (stateKey === undefined) return state
  if (typeof stateKey !== 'string') {
    shadowError(
      'shadowbind_subscribe_key_type',
      `The key ${JSON.stringify(stateKey)} must be a string, but it was ` +
      `"${typeof stateKey}"`
    )
  }
  if (!/^[^.].+[^.]$/.test(stateKey)) { // cannot begin or end with dot
    shadowError(
      'shadowbind_subscribe_key_invalid',
      `The key "${stateKey}" could not be parsed`
    )
  }
  if (stateKey.indexOf('.') === -1) {
    if (!Object.keys(state).includes(stateKey)) {
      shadowError(
        'shadowbind_subscribe_key_not_found',
        `The key "${stateKey}" could not be found in the published state`
      )
    }
  }
  return applyDots(
    state,
    stateKey,
    'state',
    'published state',
    'shadowbind_subscribe_key_not_found'
  )
}

function applyDots (baseData, key, baseName, errorSource, errorCode) {
  trace.search = [[`${baseName}:`, baseData]]
  let search = baseData
  let keySearch = baseName
  for (const keyPart of key.split('.')) {
    keySearch = `${keySearch}.${keyPart}`
    if (!Object.keys(search).includes(keyPart)) {
      trace.search.push([`${keySearch}:`, 'not found'])
      delete trace.publishedState
      shadowError(
        errorCode,
        `The key "${keyPart}" in "${key}" could not be found in the ` +
          errorSource
      )
    }
    search = search[keyPart]
    trace.search.push([`${keySearch}:`, search])
  }
  delete trace.search
  return search
}

// Apply the state to the element's shadowDom
function bindComponent (component, bindings) {
  shadowWalk(component, bindings, (element, localBindings) => {
    attributeWalk(element, attribute => {
      const bindAction = parseAttribute(attribute)
      trace.element = element
      if (bindAction) bindElement(element, localBindings, bindAction)
    })
    delete trace.element
    delete trace.attribute
  })
}

// Run callback on every element in the shadowDom, applying repeaters as needed
function shadowWalk (component, bindings, callback) {
  const getLocalBindings = GetLocalBindings(bindings)
  // let domDepth = 0

  function recursiveWalk (node) {
    respondToElement(node/* , domDepth */)
    node = node.firstChild
    // domDepth++
    while (node) {
      recursiveWalk(node, respondToElement)
      node = node.nextSibling
    }
    // domDepth--
  }

  function respondToElement (element /* , domDepth */) {
    let repeatId
    if (element.nodeType !== 1) return // not an element
    const localBindings = getLocalBindings.current()
    let as
    let loopKey
    if (element.getAttribute(':for')) {
      repeatId = initializeRepeat(element)
      as = repeaters[repeatId].as
      loopKey = repeaters[repeatId].loopKey
      localBindings[as] = localBindings[loopKey][0].name
      applyRepeat(component, repeatId, null, localBindings)
    }

    callback(element, localBindings)
  }

  if (!component.shadowRoot) {
    try {
      component.attachShadow({ mode: 'open' })
    } catch (err) {
      trace = { component: trace.component }
      shadowError(
        'shadowbind_closed_shadow_root',
        'Subscribed element has a closed shadowRoot, but only open ' +
          'shadowRoots are supported'
      )
    }
    trace = { component: trace.component }
    shadowError(
      'shadowbind_no_shadow_root',
      'Subscribed web component has no shadowRoot. Be sure to call ' +
        "this.attachShadow({ mode: open }) in the component's constructor"
    )
  }
  recursiveWalk(component.shadowRoot)
}

// Keep track of bound state as it is altered by nested repeaters
function GetLocalBindings (bindings) {
  return {
    update: (repeater, domDepth) => {},
    current: () => bindings
  }
}

// Convert attributes into data-binding instructions
function parseAttribute (attr) {
  let param = null
  let type
  const key = attr.value
  let matches = /^:(text|html|show|css)$/.exec(attr.name)
  if (matches) {
    type = matches[1]
  } else {
    matches = /^(bind|attr|prop|on):(.{1,})$/.exec(attr.name)
    if (matches) {
      type = matches[1]
      param = matches[2]
    }
  }
  if (!type) return null
  return { type, param, key }
}

// Run callback on every attribute of a dom element
function attributeWalk (element, callback) {
  // if (!element || !element.attributes) return
  for (const attribute of element.attributes) {
    if (!attribute.name) return
    trace.attribute = attribute
    callback(attribute)
  }
  delete trace.attribute
}

// Apply data-binding to a particular element
function bindElement (element, localBindings, bindAction) {
  const { type, param, key } = bindAction
  let value
  if (key.indexOf('.') === -1) {
    if (!Object.keys(localBindings).includes(key)) {
      const searchSource = trace.bindReturned
        ? 'the object returned by bind()'
        : 'the subscribed state'
      shadowError(
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
  trace.attributeState = value
  let valueType = typeof value
  if (Array.isArray(value)) valueType = 'array'
  if (value === null) valueType = 'null'
  if (
    (valueType === 'object' || valueType === 'array') &&
    (type === 'bind' || type === 'text' || type === 'html')
  ) {
    const bindSubnote = type === 'bind'
      ? ` or use prop:${param} to bind the data as a property instead of an ` +
        'attribute'
      : ''
    shadowError(
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
      if (value != null) element.innerText = value
      break
    case 'html':
      if (value != null) element.innerHTML = value
      break
    case 'on':
      if (typeof value !== 'function') {
        shadowError(
          'shadowbind_event_type',
          `"${key}" must be a function, but it was "${typeof value}"`
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
      for (const cssProp of Object.keys(value)) {
        element.style.setProperty(`--${cssProp}`, value[cssProp])
      }
      break
  }
}

// Remove the user's repeater element and store the instructions for later
function initializeRepeat (example) {
  repeaterCount++
  const parent = example.parentNode
  const repeatId = setRepeatId(example)
  const matches = /^([^ ]{1,}) of ([^ ]{1,})$/.exec(
    example.getAttribute(':for'))

  repeaters[repeatId] = {
    parent,
    as: matches[1],
    loopKey: matches[2],
    uniqueId: example.getAttribute(':key'),
    example: (() => {
      parent.removeChild(example)
      example.removeAttribute(`:for`)
      example.removeAttribute(`:key`)
      return example
    })()
  }
  return repeatId
}

// Create, move, remove and modify a repeater (does not apply data-binding)
function applyRepeat (component, repeatId, prependElement, localBindings) {
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

  for (const item of localBindings[loopKey]) {
    let element
    if (currentItems.includes(item[uniqueId] + '')) {
      element = el(`[key="${item[uniqueId]}"][${repeatId}]`)
    } else {
      element = example.cloneNode(true)
    }

    parent.insertBefore(element, prependElement)
    element.setAttribute('key', item[uniqueId])
    setRepeatId(element)
  }

  const newRepeatId = setRepeatId(example)
  if (repeatId) {
    elAll(`[${repeatId}]`, component.shadowRoot)
      .map(item => parent.removeChild(item))
  }

  if (elAll(`[${newRepeatId}]`, component.shadowRoot).length === 0) {
    let placeholder = document.createElement('span')
    placeholder.setAttribute('sb:repeat', '')
    setRepeatId(placeholder)
    parent.insertBefore(placeholder, prependElement)
  }
  repeaters[newRepeatId] = repeaters[repeatId]
  delete repeaters[repeatId]
}

function setRepeatId (element, type) {
  let repeaterCounter = `r${repeaterCount}`
  for (let attr of element.attributes) {
    if (!attr.name) continue
    let match = /^(r\d+)$/.exec(attr.name)
    if (match) element.removeAttribute(attr.name)
  }
  element.setAttribute(repeaterCounter, '')
  return repeaterCounter
}

// function getRepeatId (element) {
//   for (let attr of element.attributes) {
//     if (!attr.name) continue
//     let match = /^(r\d+)$/.exec(attr.name)
//     if (match) return attr.name
//   }
// }

// Attach identifiers for elements that otherwise cannot be uniquely identified
function domKeyGenerator () {
  let internalCounter = 0
  return (type, element) => {
    let newDomKey
    if (type === 'event') newDomKey = `sb:${internalCounter}`
    element.setAttribute(newDomKey, '')
    internalCounter++
    return newDomKey
  }
}

const setDomKey = domKeyGenerator()

function getDomKey (type, element) {
  for (let attr of element.attributes) {
    if (!attr.name) continue
    let match
    if (type === 'event') match = /^(sb:\d+)$/.exec(attr.name)
    if (match) return match[1]
  }
  return false
}

function el (selector, context = document) {
  selector = selector.replace(':', '\\:')
  return context.querySelector(selector)
}

function elAll (selector, context = document) {
  selector = selector.replace(':', '\\:')
  return Array.prototype.slice.call(
    context.querySelectorAll(selector)
  )
}

function shadowError (code, errorMessage, notes) {
  const TRACE_START = '\n\n    '
  const TRACE_LINE = '\n    '

  let message = [errorMessage]
  const traceOrder = [
    ...(trace.search ? trace.search : []),
    ['attribute state:', trace.attributeState],
    ['bind returned:', trace.bindReturned],
    ['subscribed state:', trace.subscribedState],
    ['published state:', trace.publishedState],
    ['affected attribute:', trace.attribute],
    ['affected element:', trace.element],
    ['affected web component:', trace.component]
  ]

  if (Object.keys(trace).length) {
    message.push(TRACE_START)
    for (const [traceIntro, traceData] of traceOrder) {
      if (traceData) message.push(traceIntro, traceData, TRACE_LINE)
    }
  }

  if (notes) message.push('\n\n' + notes)

  console.error(...message)
  throw { code }
}
