import Shadowbind from '../../../src/index.js'

class Repeat1 extends Shadowbind.Element {
  bindings () {
    return { myData: [{}, {}, {}] }
  }
  template () {
    return /* @html */`<repeat-2 :map="myData"></repeat-2>`
  }
}

class Repeat2 extends Shadowbind.Element {
  bindings () {
    return { myData: [{ num: 1 }, { num: 2 }, { num: 3 }] }
  }
  template () {
    return /* @html */`<repeat-3 :map="myData"></repeat-3>`
  }
}

class Repeat3 extends Shadowbind.Element {
  template () {
    return /* @html */`<span :text="num"></span>`
  }
}

class RepeaterNested extends Shadowbind.Element {
  constructor () {
    super()
    this.data({ myData: [{ num: 1 }, { num: 2 }, { num: 3 }] })
    throw new Error('this is weird')
  }
  getActual () {
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
  template () {
    return /* @html */`<repeat-1 :map="myData"></repeat-1>`
  }
}

Shadowbind.define({
  RepeaterNested,
  'repeat-1': Repeat1,
  'repeat-2': Repeat2,
  'repeat-3': Repeat3
})
