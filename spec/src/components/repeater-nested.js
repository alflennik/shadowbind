import { subscribe, publish } from '../../../src/index.js'

class Repeat1 extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <repeat-2 :for="myData"></repeat-2>`
  }
  bind (state) {
    return { myData: [1, 2, 3] }
  }
}

class Repeat2 extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <repeat-3 :for="myData"></repeat-3>`
  }
  bind (state) {
    return { myData: [1, 2, 3] }
  }
}

class Repeat3 extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <span :text="myText"></span>`
  }
  bind (state) {
    return { myText: state }
  }
}

class RepeaterNested extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <repeat-1 :for="myData"></repeat-1>`
  }

  getActual () {
    publish({ myData: [1, 2, 3] })
    let results = []
    for (const repeat1 of this.shadowRoot.querySelectorAll('repeat-1')) {
      for (const repeat2 of repeat1.shadowRoot.querySelectorAll('repeat-2')) {
        for (const repeat3 of repeat2.shadowRoot.querySelectorAll('repeat-3')) {
          results.push(repeat3.shadowRoot.querySelector('span').innerText)
        }
      }
    }
    return results
  }

  getExpected () {
    return [
      '1', '2', '3', '1', '2', '3', '1', '2', '3',
      '1', '2', '3', '1', '2', '3', '1', '2', '3',
      '1', '2', '3', '1', '2', '3', '1', '2', '3'
    ]
  }
}

window.customElements.define('repeater-nested', RepeaterNested)
window.customElements.define('repeat-1', Repeat1)
window.customElements.define('repeat-2', Repeat2)
window.customElements.define('repeat-3', Repeat3)
