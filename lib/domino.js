import walkDom from 'dom-walk'

/**
 * TODO:
 * CSS should bind with :css="binding"
 * Only bind when upstream data changed
 * Loops needed
 * Add headless browser tests
 * Bind overall state
 */

let subscribedComponents = []
let eventStorage = {}
let previousState

export function publish (state) {
  if (state === previousState) return
  for (const subscribedComponent of subscribedComponents) {
    const { selector, stateKey } = subscribedComponent
    if (
      stateKey && previousState && state[stateKey] === previousState[stateKey]
    ) continue
    let bindings
    const localState = stateKey ? state[stateKey] : state
    if (typeof selector.bind !== 'undefined') {
      bindings = selector.bind(localState)
    } else {
      bindings = localState
    }
    walk(selector, bindings)
    previousState = state
  }
}

export function subscribe (selector, stateKey) {
  subscribedComponents.push({ selector, stateKey })
}

function walk (selector, bindings) {
  walkDom(selector.root, node => {
    walkAttributes(node, attribute => {
      const bindAction = parseAttribute(attribute)
      if (bindAction) applyBind(node, bindings, bindAction)
    })
    if (bindings && 'css' in bindings) attachCssProps(selector, bindings.css)
  })
}

function walkAttributes (element, callback) {
  if (!element.attributes) return
  for (const attribute of element.attributes) {
    if (!attribute.name) return
    callback(attribute)
  }
}

function parseAttribute (attr) {
  let param = null
  let type
  const key = attr.value
  let matches = /^:(text|html|for|key|show)$/.exec(attr.name)
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
  }
}

function attachCssProps (selector, cssProps) {
  for (const key of Object.keys(cssProps)) {
    selector.shadowRoot.children[0].style.setProperty(`--${key}`, cssProps[key])
  }
}

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

function escapeHtml (input) {
  input += ''
  return input
   .replace(/&/g, '&amp;')
   .replace(/</g, '&lt;')
   .replace(/>/g, '&gt;')
   .replace(/"/g, '&quot;')
   .replace(/'/g, '&#039;')
}
