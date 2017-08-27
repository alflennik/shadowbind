let subscribedComponents = []
let eventStorage = {}
let previousState = null

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
  shadowWalk(component.root, bindings, (element, localBindings) => {
    attributeWalk(element, attribute => {
      const bindAction = parseAttribute(attribute)
      if (bindAction) bindElement(element, localBindings, bindAction)
    })
  })
}

// Run callback on every element in the shadowDom, applying repeaters as needed
function shadowWalk (component, bindings, callback) {
  const walkTool = getWalkTool(component)
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
    debugger
  }
}

function walkDom (node, callback) {
  if (callback(node) !== false) {
    node = node.firstChild
    while (node) {
      walkDom(node, callback)
      node = node.nextSibling
    }
  }
}

  function getNextNode (node) {
    if (node.firstChild) return node.firstChild
    if (node.nextSibling) return node.nextSibling
  }

  function isElement (node) {
    return node && node.nodeType === 1
  }

  return {
    next: () => {
      let node = element
      do node = getNextNode((node || element))
      while (!isElement(node) || node !== false)

      if (node === false || depth < 0) return false

      debugger
      element = node
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
function attributeWalk (element, callback) {
  if (!element || !element.attributes) return
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
function bindElement (element, bindings, bindAction) {
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
