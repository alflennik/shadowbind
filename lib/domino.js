import walkDom from 'dom-walk'

export function publish (state) {
  for (const webComponent of webComponents) {
    const { selector, stateKey } = webComponent
    const bindings = selector.bind(state[stateKey])
    walk(selector, bindings)
  }
  console.log(eventStorage)
}

let webComponents = []

let eventStorage = {}

export function subscribe (selector, stateKey) {
  webComponents.push({ selector, stateKey })
}

function walk (selector, bindings) {
  walkDom(selector.root, node => {
    walkAttributes(node, attribute => {
      const bindAction = parseAttribute(attribute)
      if (bindAction) applyBind(node, bindings, bindAction)
    })
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
    matches = /^(attr|prop|on):([\w]{1,})$/.exec(attr.name)
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
      break
    case 'text':
      node.innerHTML = escapeHtml(value)
      break
    case 'html':
      node.innerHTML = value
      break
    case 'on':
      // event
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

// let found = element.shadowRoot.querySelector('[this\\3A html]')
