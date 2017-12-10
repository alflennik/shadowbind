// Keep track of bound state as it is altered by nested repeaters

let repeaters = []
let repeaterCounts = []
let bindings

export function newBindings (theNewBindings) {
  bindings = { ...theNewBindings }
}

export function current () {
  let localBindings = { ...bindings }
  for (let i = 0; i < repeaters.length; i++) {
    const repeater = repeaters[i][repeaterCounts[i]]
    localBindings = { ...localBindings, ...repeater }
  }
  return localBindings
}

export function startRepeater (bindings) {
  repeaters.push(bindings)
  repeaterCounts.push(0)
}

export function incrementRepeater () {
  repeaterCounts[repeaterCounts.length - 1]++
}

export function endRepeater () {
  repeaters.splice(-1)
  repeaterCounts.splice(-1)
}
