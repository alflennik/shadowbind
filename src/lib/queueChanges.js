import getBindings from './getBindings.js'
import bindComponent from './bindComponent.js'
import { state } from '../publish.js'

let queue = {}
let queueProcessing = false

export default function queueChanges (component, changes = {}) {
  let { id, depth } = component.sbPrivate
  depth = 0 // TODO: actually use the real depth
  if (!queue[depth]) queue[depth] = {}
  if (!queue[depth][id]) queue[depth][id] = {}

  Object.assign(queue[depth][id], changes)
  queue[depth][id].component = component

  processQueue()
}

function processQueue () {
  if (queueProcessing) return
  queueProcessing = true

  let queueItem = getNextQueue()
  while (queueItem) {
    const component = queueItem.component
    delete queueItem.component
    const bindings = getBindings(component, queueItem)
    try {
      bindComponent(component, bindings)
    } catch (err) {
      // Reenable the queue if errors are caught by the user (common in tests)
      queueProcessing = false
      throw err
    }

    queueItem = getNextQueue()
  }

  queueProcessing = false
}

function getNextQueue () {
  const queueItems = Object.entries(queue['0'])
  if (!queueItems.length) return false
  const [id, queueItem] = queueItems[0]
  delete queue['0'][id]
  return queueItem
}
