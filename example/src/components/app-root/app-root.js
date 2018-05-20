import Shadowbind from 'shadowbind'
import * as counter from '../../actions/counter'

class AppRoot extends Shadowbind.Element {
  increment() {
    counter.increment()
  }
  template() {
    return /* @html */`
      <style>
        :host { font-family: sans-serif; }
      </style>
      <count-viewer></count-viewer>
      <button on:click="increment">Increment</button>
    `
  }
}

Shadowbind.define({ AppRoot })
