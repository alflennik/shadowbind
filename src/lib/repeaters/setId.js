let repeaterCount = 0

export function nextId () {
  repeaterCount++
}

export function setId (element) {
  let repeaterCounter = `sb:r${repeaterCount}`
  for (let attr of element.attributes) {
    if (!attr.name) continue
    let match = /^(sb:r\d+)$/.exec(attr.name)
    if (match) element.removeAttribute(attr.name)
  }
  element.setAttribute(repeaterCounter, '')
  return repeaterCounter
}
