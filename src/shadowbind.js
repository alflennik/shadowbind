let subscribedComponents = []
let eventStorage = {}
let previousState = null

// Track subscribed web components
export function subscribe (selector, stateKey) {
  subscribedComponents.push({ selector, stateKey })
}

// Apply data-binding to all affected web components when the state changes
export function publish (state) {
  if (previousState !== null && state === previousState) return
  for (const subscribedComponent of subscribedComponents) {
    const { selector, stateKey } = subscribedComponent
    if (
      previousState && stateKey && state[stateKey] === previousState[stateKey]
    ) continue
    let bindings
    const localState = stateKey ? state[stateKey] : state
    if (typeof selector.bind !== 'undefined') {
      bindings = selector.bind(localState)
    } else {
      bindings = localState
    }
    walk(selector, bindings)
  }
  previousState = state
}

// Apply the state to the element's shadowDom
function walk (selector, bindings) {
  walkDom(selector.root, bindings, (element, localBindings) => {
    walkAttributes(element, attribute => {
      const bindAction = parseAttribute(attribute)
      if (bindAction) applyBind(element, localBindings, bindAction)
    })
  })
}

// Run callback on every element in the shadowDom, applying repeaters as needed
function walkDom (selector, bindings, callback) {
  const walkTool = getWalkTool(selector)
  const stateTracker = getStateTracker(bindings)

  while (walkTool.next()) {
    const { element, depth } = walkTool.current()
    stateTracker.updateDepth(depth)
    const localState = stateTracker.current()
    const repeater = parseRepeater(element)
    if (repeater) {
      stateTracker.applyRepeater(repeater)
      applyRepeater(repeater)
    }
    callback(element, localState)
  }
}

// Return every element in the shadowDom while tracking the depth for repeaters
function getWalkTool (selector) {
  let depth = 0
  let element = selector

  return {
    next: () => {
      if (element.childNodes) {
        depth++
        element = element.firstChild
      } else if (element.nextSibling) {
        element = element.nextSibling
      } else if (element.parentNode()) {
        depth--
        element = element.parentNode()
      } else {
        return false
      }

      if (depth < 0) return false
      return true
    },
    current: () => {
      return { element, depth }
    }
  }
}

// Keep track of bound state as it is altered by nested repeaters
function getStateTracker (initial) {
  // let layers = { 1: initial }
  // let previousDepth
  // let depth
  return {
    updateDepth: depth => {},
    current: () => initial,
    applyRepeater: repeater => {}
  }
}

// Run callback on every attribute of a dom element
function walkAttributes (element, callback) {
  if (!element.attributes) return
  for (const attribute of element.attributes) {
    if (!attribute.name) return
    callback(attribute)
  }
}

// Parse a repeater element and return salient features
function parseRepeater (element) {
  return false
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
    matches = /^(attr|prop|on):(.{1,})$/.exec(attr.name)
    if (matches) {
      type = matches[1]
      param = matches[2]
    }
  }
  if (!type) return null
  return { type, param, key }
}

// Create, move and remove elements within a repeater
function applyRepeater (repeater) {}

// Apply data-binding to a particular element
function applyBind (element, bindings, bindAction) {
  const { type, param, key } = bindAction
  const value = bindings[key]
  switch (type) {
    case 'attr':
      if (value !== null) element.setAttribute(param, value)
      else element.removeAttribute(param)
      break
    case 'text':
      if (value !== undefined || value !== null) {
        element.innerHTML = escapeHtml(value)
      }
      break
    case 'html':
      if (value !== undefined || value !== null) {
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

// Attach identifiers for elements that otherwise cannot be uniquely identified
function domKeyGenerator () {
  let internalCounter = 0
  return element => {
    const newDomKey = `dom${internalCounter}`
    element.setAttribute(newDomKey, '')
    internalCounter++
    return newDomKey
  }
}

const setDomKey = domKeyGenerator()

function getDomKey (element) {
  for (let attr of element.attributes) {
    if (!attr.name) continue
    const match = /^(dom\d+)$/.exec(attr.name)
    if (match) return match[1]
  }
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
