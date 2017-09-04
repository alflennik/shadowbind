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
    domDepth++
    while (node) {
      recursiveWalk(node, respondToElement)
      node = node.nextSibling
    }
    domDepth--
  }

  function respondToElement (element, domDepth) {
    if (element.nodeType !== 1) return // not an element
    const repeater = parseRepeater(element)
    if (repeater) {
      getLocalBindings.update(repeater, domDepth)
      applyRepeater(repeater)
    }
    const localBindings = getLocalBindings.current()
    callback(element, localBindings)
  }

  recursiveWalk(component.root)
}

// Keep track of bound state as it is altered by nested repeaters
function generateLocalBindings (bindings) {
  // let layers = { 1: initial }
  // let previousDepth
  // let depth
  return {
    update: (repeater, domDepth) => {},
    current: () => bindings
  }
}

// Create, move and remove elements within a repeater
function applyRepeater (repeater) {}

window.applyRepeater = applyRepeater

// Parse a repeater element and return salient features
function parseRepeater (element) {
  const loop = element.getAttribute(':for')
  if (!loop) return false
  const uniqueId = element.getAttribute(':key')
  const previousDomKey = getDomKey('for', element)
  // get bindingKey, newKeyName
  return { bindingKey, newKeyName, uniqueId, previousDomKey }
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

// Attach identifiers for elements that otherwise cannot be uniquely identified
function domKeyGenerator () {
  let internalCounter = 0
  return (type, element) => {
    let newDomKey
    if (type === 'event') newDomKey = `sb{internalCounter}`
    if (type === 'for') newDomKey = `sbfor{internalCounter}`
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
    if (type === 'event') match = /^(sb\d+)$/.exec(attr.name)
    if (type === 'for') match = /^(sbfor\d+)$/.exec(attr.name)
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
