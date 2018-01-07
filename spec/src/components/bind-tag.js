import { subscribe, publish } from '../../../src/index.js'

let eventHasRun = false

function doTest (shadowRoot) {
  const testEl = shadowRoot.querySelector('#tag-switcher')
  const stillHasAttr = testEl.getAttribute('data') === 'should not be removed'
  const stillHasChildren = (() => {
    const child = shadowRoot.querySelector('#tag-switcher > h1 > span')
    if (!child) return false
    return child.innerHTML === 'Child Element'
  })()

  const stillHasEvents = (() => {
    eventHasRun = false
    testEl.dispatchEvent(new Event('click')) // eslint-disable-line
    return eventHasRun
  })()

  return [
    testEl.tagName.toLowerCase(),
    stillHasAttr ? 'attrOK' : 'NO ATTR!',
    stillHasChildren ? 'childrenOK' : 'NO CHILDREN!',
    stillHasEvents ? 'eventsOK' : 'NO EVENTS!'
  ]
}

class BindTag extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = /* @html */`
    <div :tag="currentTag"
    data="should not be removed"
    on:click="eventTest"
    id="tag-switcher">
      <h1><span>Child Element</span></h1>
    </div>`
  }
  bind (state) {
    return {
      ...state,
      eventTest: event => {
        eventHasRun = true
      }
    }
  }
  getExpected () {
    return [
      ['div', 'attrOK', 'childrenOK', 'eventsOK'],
      ['app-container', 'attrOK', 'childrenOK', 'eventsOK'],
      ['app-page', 'attrOK', 'childrenOK', 'eventsOK'],
      ['span', 'attrOK', 'childrenOK', 'eventsOK']
    ]
  }
  getActual () {
    publish({ currentTag: 'div' })
    const shadowRoot = document.querySelector('bind-tag').shadowRoot
    let tests = []
    tests.push(doTest(shadowRoot))
    publish({ currentTag: 'app-container' })
    tests.push(doTest(shadowRoot))
    publish({ currentTag: 'app-page' })
    tests.push(doTest(shadowRoot))
    publish({ currentTag: 'span' })
    tests.push(doTest(shadowRoot))
    return tests
  }
}

window.customElements.define('bind-tag', BindTag)
