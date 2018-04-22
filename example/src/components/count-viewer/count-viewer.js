import Shadowbind from '../../../../dist/shadowbind'

class CountViewer extends Shadowbind.Element {
  subscribe() {
    return { counter: 'state' }
  }
  template() {
    return /* @html */`
      <h1>Counter</h1>
      Count: <span :text="counter"></span>
    `
  }
}

Shadowbind.define({ CountViewer })
