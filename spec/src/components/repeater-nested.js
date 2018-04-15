import Shadowbind from '../../../src/index.js'

class Repeat1 extends window.HTMLElement {
  template () {
    return /* @html */`<repeat-2 :publish="myData"></repeat-2>`
  }
  bind (state) {
    return { myData: [1, 2, 3] }
  }
}

class Repeat2 extends window.HTMLElement {
  template () {
    return /* @html */`<repeat-3 :publish="myData"></repeat-3>`
  }
  bind (state) {
    return { myData: [1, 2, 3] }
  }
}

class Repeat3 extends window.HTMLElement {
  template () {
    return /* @html */`<span :text="myText"></span>`
  }
  bind (state) {
    return { myText: state }
  }
}

class RepeaterNested extends window.HTMLElement {
  template () {
    return /* @html */`<repeat-1 :publish="myData"></repeat-1>`
  }
  getActual () {
    this.publish({ myData: [1, 2, 3] })
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

define(RepeaterNested)
define('repeat-1', Repeat1)
define('repeat-2', Repeat2)
define('repeat-3', Repeat3)
