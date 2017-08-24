import domWalk from 'dom-walk'

export function publish (state) {
  for (const webComponent of webComponents) {
    const { selector, stateKey } = webComponent
    const bindings = selector.bind(state[stateKey])
    walk(selector, bindings)
  }
}

let webComponents = []

export function subscribe (selector, stateKey) {
  webComponents.push({ selector, stateKey })
}

function walk (selector, bindings) {
  domWalk(selector.root, node => {
    console.log('node')
    for (let attr of node.attributes) {
      console.log(attr)
    }
  })
}
