import Shadowbind from '../../../src/index.js'

class LifecycleCallbacks extends Shadowbind.Element {
  constructor () {
    super()
    this.sequence = []
  }
  getActual () {
    return this.sequence
  }
  getExpected () {
    return ['beforeBindCallback', 'bindings', 'afterBindCallback']
  }
  beforeBindCallback () {
    this.sequence.push('beforeBindCallback')
  }
  afterBindCallback () {
    this.sequence.push('afterBindCallback')
  }
  bindings () {
    this.sequence.push('bindings')
    return {}
  }
  template () {
  }
}

Shadowbind.define({ LifecycleCallbacks })
