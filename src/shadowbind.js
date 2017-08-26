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
  walkDom(selector.root, bindings, (node, localBindings) => {
    walkAttributes(node, attribute => {
      const bindAction = parseAttribute(attribute)
      if (bindAction) applyBind(node, localBindings, bindAction)
    })
  })
}

// Run callback on every element in the shadowDom, applying repeaters as needed
function walkDom (selector, bindings, callback) {
  const walkTool = getWalkTool(selector)
  const stateTracker = getStateTracker(bindings)

  while (walkTool.next()) {
    const { node, depth } = walkTool.current()
    stateTracker.updateDepth(depth)
    const localState = stateTracker.current()
    callback(node, localState)
    const repeater = parseRepeater(node)
    if (repeater) {
      applyRepeater(repeater)
      stateTracker.applyRepeater(repeater)
    }
  }
}

// Return every element in the shadowDom while tracking the depth for repeaters
function getWalkTool (selector) {
  let depth
  let node
  return {
    next: () => {
      return null
    },
    current: () => {
      return { node, depth }
    }
  }
}

// Keep track of bound state as it is altered by nested repeaters
function getStateTracker (initial) {
  let layers = { 1: initial }
  let previousDepth
  return {
    updateDepth: (depth) => {},
    current: () => initial,
    applyRepeater: () => {}
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
function parseRepeater (node) {}

// Convert attributes into data-binding instructions
function parseAttribute (attr) {
  let param = null
  let type
  const key = attr.value
  let matches = /^:(text|html|for|key|show|css)$/.exec(attr.name)
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
function applyBind (node, bindings, bindAction) {
  const { type, param, key } = bindAction
  const value = bindings[key]
  switch (type) {
    case 'attr':
      if (value !== null) node.setAttribute(param, value)
      else node.removeAttribute(param)
      break
    case 'text':
      if (value !== undefined || value !== null) {
        node.innerHTML = escapeHtml(value)
      }
      break
    case 'html':
      if (value !== undefined || value !== null) {
        node.innerHTML = value
      }
      break
    case 'on':
      let domKey = getDomKey(node)
      if (!domKey) domKey = setDomKey(node)
      if (!eventStorage[domKey]) eventStorage[domKey] = {}
      if (!eventStorage[domKey][param] && eventStorage[domKey][param] !== key) {
        node.addEventListener(param, value)
        eventStorage[domKey][param] = key
      }
      break
    case 'show':
      if (!value) node.style.display = 'none'
      else node.style.display = ''
      break
    case 'css':
      for (const cssProp of Object.keys(value)) {
        node.style.setProperty(`--${cssProp}`, value[cssProp])
      }
      break
  }
}

// Attach identifiers for elements that otherwise cannot be uniquely identified
function domKeyGenerator () {
  let internalCounter = 0
  return node => {
    const newDomKey = `dom${internalCounter}`
    node.setAttribute(newDomKey, '')
    internalCounter++
    return newDomKey
  }
}

const setDomKey = domKeyGenerator()

function getDomKey (node) {
  for (let attr of node.attributes) {
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
