import addBindings from './addBindings.js'
import bindComponent from './bindComponent.js'

let queue = []
let processing = true

export function start () {
  processing = true
  processQueue()
}

export function stop () {
  processing = false
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
  if (!processing) return

  let queueItem = nextQueueItem()
  console.log(queueItem)
  while (queueItem) {
    queueItem.component.sbPrivate.data = Object.assign(
      queueItem.component.sbPrivate.bindings,
      queueItem.component.sbPrivate.direct
    )
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
