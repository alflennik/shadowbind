let removedByIf = {}
let removedCount = 0

export function replaceWithPlaceholder (element) {
  const placeholder = createPlaceholder(element)
  const sibling = element.nextElementSibling
  const parent = element.parentNode
  removedByIf[removedCount] = element
  parent.removeChild(element)
  parent.insertBefore(placeholder, sibling)
}

export function putElementBack (placeholder) {
  const placeholderId = placeholder.getAttribute('sb:i')
  const element = removedByIf[placeholderId]
  const sibling = placeholder.nextElementSibling
  const parent = placeholder.parentNode
  parent.removeChild(placeholder)
  parent.insertBefore(element, sibling)
}

function createPlaceholder (element) {
  removedCount++
  const placeholder = document.createElement('span')
  placeholder.setAttribute('sb:i', removedCount)
  placeholder.setAttribute(':if', element.getAttribute(':if'))
  return placeholder
}
