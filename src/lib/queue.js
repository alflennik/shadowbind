import { addBindings, flattenBindings } from './addBindings.js'
import bindComponent from './bindComponent.js'

let queue = []
let stopCount = 0

export function start () {
  if (stopCount > 0) stopCount--
  processQueue()
}

export function stop () {
  stopCount++
}

export function add (component, changes = {}) {
  let { id } = component.sbPrivate
  const depth = component.sbPrivate.getDepth()
  if (!queue[depth]) queue[depth] = {}
  if (!queue[depth][id]) queue[depth][id] = {}
  if (!queue[depth][id].changes) queue[depth][id].changes = {}

  Object.assign(queue[depth][id].changes, changes)
  addBindings(component, changes)
  queue[depth][id].component = component

  processQueue()
}

function processQueue () {
  if (stopCount !== 0) return

  let queueItem = nextQueueItem()
  while (queueItem) {
    flattenBindings(queueItem.component)
    bindComponent(queueItem.component, queueItem.component.sbPrivate.data)
    queueItem = nextQueueItem()
  }
}

function nextQueueItem () {
  const currentDepth = (() => {
    for (let i = 0; i < queue.length; i++) {
      if (!queue[i]) continue
      return i
    }
    if (queue.length > 0) queue = [] // Queue was filled with undefined
    return false
  })()

  if (currentDepth === false) return

  for (const id in queue[currentDepth]) {
    const queueItem = queue[currentDepth][id]
    delete queue[currentDepth][id]
    if (Object.keys(queue[currentDepth]).length === 0) {
      queue[currentDepth] = undefined
    }
    return queueItem
  }
}
