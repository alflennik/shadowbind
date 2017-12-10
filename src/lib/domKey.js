// Attach identifiers for elements that otherwise cannot be uniquely identified
function domKeyGenerator () {
  let internalCounter = 0
  return (type, element) => {
    let newDomKey
    if (type === 'event') newDomKey = `sb:${internalCounter}`
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
    if (type === 'event') match = /^(sb:\d+)$/.exec(attr.name)
    if (match) return match[1]
  }
  return false
}

export { getDomKey, setDomKey }
