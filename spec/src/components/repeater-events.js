import Shadowbind from '../../../src/index.js'

let innerClicked
let outerClicked

class RepeaterEvents extends Shadowbind.Element {
  outerClicked (event) {
    outerClicked = true
  }
  testEvent () {
    let tests = []
    const repeatedItems = this.shadowRoot.querySelectorAll('.repeatedElement')
    for (const repeatedItem of repeatedItems) {
      innerClicked = false
      outerClicked = false
      repeatedItem.dispatchEvent(new window.Event('click'))
      tests.push(innerClicked && outerClicked)
    }
    return tests
  }
  getActual () {
    let tests = []
    this.data({ myData: [{}] })
    tests.push(this.testEvent())
    this.data({ myData: [{}, {}] })
    tests.push(this.testEvent())
    this.data({ myData: [{}, {}, {}] })
    tests.push(this.testEvent())
    this.data({ myData: [] })
    this.data({ myData: [{}] })
    tests.push(this.testEvent())
    return tests
  }
  getExpected () {
    return [
      [true],
      [true, true],
      [true, true, true],
      [true]
    ]
  }
  template () {
    return /* @html */`
      <repeater-events-item :map="myData" on:click="outerClicked" class="repeatedElement">
      </repeater-events-item>
    `
  }
}

class RepeaterEventsItem extends Shadowbind.Element {
  constructor () {
    super()
    this.addEventListener('click', () => {
      innerClicked = true
    })
  }
  template () {
    return /* @html */`<p>Item</p>`
  }
}

Shadowbind.define({ RepeaterEvents, RepeaterEventsItem })
