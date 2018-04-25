/* eslint-disable no-undef */

class GlobalShadowbindSupport extends Shadowbind.Element {
  subscribe () {
    return { fromGlobal: 'state' }
  }
  getActual () {
    Shadowbind.publish({ fromGlobal: 'worked fine, no errors' })
    return this.shadowRoot.querySelector('#test').innerText
  }
  getExpected () {
    return 'worked fine, no errors'
  }
  template () {
    return /* @html */ `
      <div :text="fromGlobal" id="test"></div>
    `
  }
}

Shadowbind.define({ GlobalShadowbindSupport })
