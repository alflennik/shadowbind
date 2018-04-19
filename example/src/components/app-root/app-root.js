import Shadowbind from '../../../../dist/shadowbind'
import * as counter from '../../actions/counter'

class AppRoot extends HTMLElement {
  constructor() {
    super()
    setTimeout(() => this.data({}), 1) // TODO: remove this godawful hack
  }
  increment() {
    counter.increment()
  }
  template() {
    return /* @html */`
      <count-viewer></count-viewer>
      <button on:click="increment">Increment</button>
    `
  }
}

Shadowbind.define(AppRoot)
