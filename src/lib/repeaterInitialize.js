import { repeaters, repeaterCount } from '../globals' // eslint-disable-line
import repeaterId from './repeaterId'

// Remove the user's repeater element and store the instructions for later
export default function initializeRepeat (example) {
  repeaterCount++
  const parent = example.parentNode
  const repeatId = repeaterId(example)
  const matches = /^([^ ]{1,}) of ([^ ]{1,})$/.exec(
    example.getAttribute(':for')
  )

  repeaters[repeatId] = {
    parent,
    as: matches[1],
    loopKey: matches[2],
    uniqueId: example.getAttribute(':key'),
    example: (() => {
      parent.removeChild(example)
      example.removeAttribute(`:for`)
      example.removeAttribute(`:key`)
      return example
    })()
  }

  return repeatId
}
