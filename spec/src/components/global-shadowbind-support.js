class GlobalShadowbindSupport extends Shadowbind.Element {
  subscribe () {
    return { fromGlobal: 'state' }
  }
  getActual () {
    // eslint-disable-next-line no-undef
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

Shadowbind.define(GlobalShadowbindSupport)  // eslint-disable-line no-undef
