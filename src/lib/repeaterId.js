import { repeaterCount } from '../globals'

export default function repeaterId (element, type) {
  let repeaterCounter = `r${repeaterCount}`
  for (let attr of element.attributes) {
    if (!attr.name) continue
    let match = /^(r\d+)$/.exec(attr.name)
    if (match) element.removeAttribute(attr.name)
  }
  element.setAttribute(repeaterCounter, '')
  return repeaterCounter
}
