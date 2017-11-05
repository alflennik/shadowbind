const STACK_START = '\n\n    '
const STACK_LINE = '\n    '
const STACK_END = '\n\n'

let components = []
let events = {}
let previousState = null
let repeaterCount = 0
let repeaters = {}
let currentRepeaters = []

// Track subscribed web components
export function subscribe (component, stateKey) {
  if (!arguments.length) {
    const message =
      'The first argument of subscribe() should be a web component, but no ' +
      'arguments were given. Call subscribe(this) in the constructor method ' +
      'of a web component\n\n' +
      'https://stackoverflow.com/questions/7505623/colors-in-javascript-console'
    console.error(message)
    throw { code: 'shadowbind_subscribe_without_arguments' }
  }

  if (component && !component.classList) { // is dom element eslint-disable-line
    const actual = typeof component
    const message =
      'The first argument of subscribe() should be a web component, not ' +
      `${actual}. Call subscribe(this) in the constructor method of a web ` +
      'component'
    console.error(message)
    throw { code: 'shadowbind_subscribe_type' }
  }

  // const isHTMLElement = component instanceof HTMLElement // eslint-disable-line
  // const isAttached = component.parentElement !== null
  // if (isHTMLElement && isAttached) {
  //   const message = 'Subscribed element is not a web component'
  //   console.error(
  //     message,
  //     STACK_START,
  //     'affected element: ', component,
  //     STACK_END
  //   )
  //   throw { code: 'shadowbind_not_web_component' }
  // }

  components.push({ component, stateKey })
}

// Apply data-binding to all affected web components when the state changes
export function publish (state) {
  if (previousState !== null && state === previousState) return
  for (const subscribedComponent of components) {
    const { component, stateKey } = subscribedComponent
    if (
      previousState && stateKey && state[stateKey] === previousState[stateKey]
    ) continue
    let bindings
    const localState = stateKey ? state[stateKey] : state
    if (typeof component.bind !== 'undefined') {
      bindings = component.bind(localState)
    } else {
      bindings = localState
    }
    bindComponent(component, bindings)
  }
  previousState = state
}

// Apply the state to the element's shadowDom
function bindComponent (component, bindings) {
  shadowWalk(component, bindings, (element, localBindings) => {
    attributeWalk(element, attribute => {
      const bindAction = parseAttribute(attribute)
      if (bindAction) bindElement(element, localBindings, bindAction)
    })
  })
}

// Run callback on every element in the shadowDom, applying repeaters as needed
function shadowWalk (component, bindings, callback) {
  const getLocalBindings = GetLocalBindings(bindings)
  // let domDepth = 0

  function recursiveWalk (node) {
    respondToElement(node/*, domDepth*/)
    node = node.firstChild
    // domDepth++
    while (node) {
      recursiveWalk(node, respondToElement)
      node = node.nextSibling
    }
    // domDepth--
  }

  function respondToElement (element/*, domDepth*/) {
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
    debugger
    const message =
      'Subscribed web component has no shadowRoot. Be sure to call ' +
      "this.attachShadow({ mode: open }) in the component's constructor"
    console.error(
      message,
      STACK_START,
      'affected web component: ', component,
      STACK_END
    )
    throw { code: 'shadowbind_no_shadow_root' }
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
    callback(attribute)
  }
}

// Apply data-binding to a particular element
function bindElement (element, localBindings, bindAction) {
  const { type, param, key } = bindAction
  const value = localBindings[key]
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
  let repeaterCount = `r${repeaterCount}`
  for (let attr of element.attributes) {
    if (!attr.name) continue
    let match = /^(r\d+)$/.exec(attr.name)
    if (match) element.removeAttribute(attr.name)
  }
  element.setAttribute(repeaterCount, '')
  return repeaterCount
}

function getRepeatId (element) {
  for (let attr of element.attributes) {
    if (!attr.name) continue
    let match = /^(r\d+)$/.exec(attr.name)
    if (match) return attr.name
  }
}

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



window.throwCssChars = function (
  propertyName,
  disallowedCharacters,
  attemptingToBind,
  affectedElement,
  documentOrComponent,
  bindReturned,
  subscribedState,
  publishedState
) {
  console.error(...[
    `Could not create the CSS custom property "${propertyName}" because it ` +
    `contains disallowed characters "${disallowedCharacters}" ` +
    `(SHADOWBIND_CSS_CHARS)\n`,
    '\n    attempting to bind', attemptingToBind,
    '\n    affected element', affectedElement,
    ...errorAffectedScope(documentOrComponent),
    ...(() => bindReturned
      ? [ '\n    bind method returned', bindReturned ] : [])(),
    '\n    subscribed state', subscribedState,
    '\n    published state', publishedState,
    '\n\nAdditional information at ' +
    'https://stackoverflow.com/questions/7505623/colors-in-javascript-console'
  ])
  throw new Error()
}

function errorAffectedScope (documentOrComponent) {
  if (documentOrComponent === document) return [ '\n    context', document ]
  return [ '\n    affected web component', documentOrComponent ]
}
