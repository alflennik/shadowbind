import Shadowbind from '../../../src/index.js'

class InitialData extends Shadowbind.Element {
  getActual () {
    let tests = []
    Shadowbind.publish({ initial: '100% awesome' })
    this.data({ inner: 'initial-data-state' })
    tests.push(this.innerContent())
    this.data({ inner: 'initial-data-attr' })
    tests.push(this.innerContent())
    return tests
  }
  getExpected () {
    return ['100% awesome', '101% awesome']
  }
  innerContent () {
    const testElement = this.shadowRoot.querySelector('#inner')
    return testElement.shadowRoot.querySelector('h1').innerText
  }
  template () {
    return /* @html */`
      <span :tag="inner" detect-attr="101% awesome" id="inner"></span>
    `
  }
}

class InitialDataState extends Shadowbind.Element {
  subscribe () {
    return { message: { state: 'initial' } }
  }
  template () {
    return /* @html */`
      <h1 :text="message">Loading from state...</h1>
    `
  }
}

class InitialDataAttr extends Shadowbind.Element {
  subscribe () {
    return { message: { attr: 'detectAttr' } }
  }
  template () {
    return /* @html */`
      <h1 :text="message">Loading from attr...</h1>
    `
  }
}

Shadowbind.define(InitialData)
Shadowbind.define(InitialDataState)
Shadowbind.define(InitialDataAttr)
