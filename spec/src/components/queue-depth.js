import Shadowbind from '../../../src/index.js'

let bindCounts = { top: 0, middle: 0, bottom: 0 }

class QueueDepth extends window.HTMLElement {
  subscribe () {
    return { myState: 'state' }
  }
  async getActual () {
    publish({ myState: 10 })
    return bindCounts
  }
  async getExpected () {
    return { top: 1, middle: 1, bottom: 1 }
  }
  bind () {
    bindCounts.top++
    return { nestedAttr: 'nested attr 1' }
  }
  template () {
    return /* @html */`
      <queue-depth-1 attr:watched="nestedAttr"></queue-depth-1>
    `
  }
}

class QueueDepth1 extends window.HTMLElement {
  subscribe () {
    return { myState: 'state', watched: 'attr' }
  }
  bind () {
    bindCounts.middle++
    return { deeper: Math.random() }
  }
  template () {
    return /* @html */`<queue-depth-2 attr:watched="deeper"></queue-depth-2>`
  }
}

class QueueDepth2 extends window.HTMLElement {
  subscribe () {
    return { myState: 'state', watched: 'attr' }
  }
  bind () {
    bindCounts.bottom++
    return {}
  }
  template () {
    return ''
  }
}

define('queue-depth-2', QueueDepth2)
define(QueueDepth)
define('queue-depth-1', QueueDepth1)
