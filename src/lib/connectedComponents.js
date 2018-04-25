export let components = {}

export function add (id, component) {
  components[id] = component
}

export function remove (id) {
  delete components[id]
}

export function getAll () {
  return Object.values(components)
}
