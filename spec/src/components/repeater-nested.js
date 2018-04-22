import Shadowbind from '../../../src/index.js'

class Repeat1 extends Shadowbind.Element {
  template () {
    return /* @html */`<repeat-2 :map="myData"></repeat-2>`
  }
  bindings (state) {
    return { myData: [1, 2, 3] }
  }
}

class Repeat2 extends Shadowbind.Element {
  template () {
    return /* @html */`<repeat-3 :map="myData"></repeat-3>`
  }
  bindings (state) {
    return { myData: [1, 2, 3] }
  }
}

class Repeat3 extends Shadowbind.Element {
  template () {
    return /* @html */`<span :text="myText"></span>`
  }
  bindings (state) {
    return { myText: state }
  }
}

class RepeaterNested extends Shadowbind.Element {
  template () {
    return /* @html */`<repeat-1 :map="myData"></repeat-1>`
  }
  getActual () {
    this.data({ myData: [1, 2, 3] })
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

Shadowbind.define({ RepeaterNested })
Shadowbind.define({ 'repeat-1':  Repeat1 })
Shadowbind.define({ 'repeat-2':  Repeat2 })
Shadowbind.define({ 'repeat-3':  Repeat3 })
