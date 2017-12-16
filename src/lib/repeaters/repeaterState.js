// Keep track of bound state as it is altered by nested repeaters

let repeaterData = []
let repeaterNames = []
let repeaterCounts = []
let bindings

export function newBindings (theNewBindings) {
  bindings = Object.assign({}, theNewBindings)
}

export function current () {
  let localBindings = Object.assign({}, bindings)
  for (let i = 0; i < repeaterData.length; i++) {
    const data = repeaterData[i][repeaterCounts[i]]
    const name = repeaterNames[i]
    let newBindings = {}
    newBindings[name] = data
    localBindings = Object.assign(localBindings, newBindings)
  }
  return localBindings
}

export function startRepeater (name, loopKey) {
  repeaterNames.push(name)
  repeaterData.push(bindings[loopKey])
  repeaterCounts.push(-1) // increment called once before the first element
}

export function incrementRepeater () {
  repeaterCounts[repeaterCounts.length - 1]++
}

export function endRepeater () {
  repeaterNames.splice(-1)
  repeaterData.splice(-1)
  repeaterCounts.splice(-1)
}
