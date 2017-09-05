let subscribedComponents = []
let eventStorage = {}
let previousState = null
let currentRepeaterKey = 0
let currentRepeaters = {}

// Track subscribed web components
export function subscribe (component, stateKey) {
  subscribedComponents.push({ component, stateKey })
}

// Apply data-binding to all affected web components when the state changes
export function publish (state) {
  if (previousState !== null && state === previousState) return
  for (const subscribedComponent of subscribedComponents) {
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
  const getLocalBindings = generateLocalBindings(bindings)
  let domDepth = 0

  function recursiveWalk (node) {
    respondToElement(node, domDepth)
    node = node.firstChild
    // domDepth++
    while (node) {
      recursiveWalk(node, respondToElement)
      node = node.nextSibling
    }
    // domDepth--
  }

  function respondToElement (element, domDepth) {
    let repeatId
    if (element.nodeType !== 1) return // not an element
    const localBindings = getLocalBindings.current()
    let as
    let loopKey
    if (element.getAttribute(':for')) {
      repeatId = initializeRepeat(element)
      as = currentRepeaters[repeatId].as
      loopKey = currentRepeaters[repeatId].loopKey
      localBindings[as] = localBindings[loopKey][0].name
      applyRepeat(component, repeatId, null, localBindings)
    }
    callback(element, localBindings)
  }

  recursiveWalk(component.root)
}

// Keep track of bound state as it is altered by nested repeaters
function generateLocalBindings (bindings) {
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
function bindElement (element, bindings, bindAction) {
  const { type, param, key } = bindAction
  const value = bindings[key]
  switch (type) {
    case 'attr':
    case 'bind':
      if (value !== null) element.setAttribute(param, value)
      else element.removeAttribute(param)
      break
    case 'text':
      if (value !== undefined && value !== null) {
        element.innerHTML = escapeHtml(value)
      }
      break
    case 'html':
      if (value !== undefined && value !== null) {
        element.innerHTML = value
      }
      break
    case 'on':
      let domKey = getDomKey(element)
      if (!domKey) domKey = setDomKey(element)
      if (!eventStorage[domKey]) eventStorage[domKey] = {}
      if (!eventStorage[domKey][param] && eventStorage[domKey][param] !== key) {
        element.addEventListener(param, value)
        eventStorage[domKey][param] = key
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

function initializeRepeat (example) {
  currentRepeaterKey++
  const parent = example.parentNode
  const repeatId = setRepeatId(example)
  const matches = /^([^ ]{1,}) of ([^ ]{1,})$/.exec(example.getAttribute(':for'))

  currentRepeaters[repeatId] = {
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

function applyRepeat (component, repeatId, prependElement, localBindings) {
  currentRepeaterKey++
  const { loopKey, uniqueId, parent, example } = currentRepeaters[repeatId]

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
    elAll(`[${repeatId}]`, component.shadowRoot).map(item => parent.removeChild(item))
  }

  debugger
  if (elAll(`[${newRepeatId}]`, component.shadowRoot).length === 0) {
    let placeholder = document.createElement('span')
    placeholder.setAttribute('sb:repeat', '')
    setRepeatId(placeholder)
    parent.insertBefore(placeholder, prependElement)
  }
  currentRepeaters[newRepeatId] = currentRepeaters[repeatId]
  delete currentRepeaters[repeatId]
}

function setRepeatId (element, type) {
  let repeaterKey = `r${currentRepeaterKey}`
  for (let attr of element.attributes) {
    if (!attr.name) continue
    let match = /^(r\d+)$/.exec(attr.name)
    if (match) element.removeAttribute(attr.name)
  }
  element.setAttribute(repeaterKey, '')
  return repeaterKey
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

// The :text data-binding attribute should not allow unescaped html within it
function escapeHtml (input) {
  input += ''
  return input
   .replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&#039;')
}

function el (selector, context = document) {
  selector = selector.replace(':', '\\:') // eslint-disable-line
  return context.querySelector(selector)
}

function elAll (selector, context = document) {
  return Array.prototype.slice.call(
    context.querySelectorAll(selector)
  )
}
