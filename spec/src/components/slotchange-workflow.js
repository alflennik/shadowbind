import Shadowbind from '../../../src/index.js'

async function waitForData (expected, getData) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (getData() === expected) {
        clearTimeout(deadmanSwitch)
        clearInterval(interval)
        resolve(getData())
      }
    }, 10)

    const deadmanSwitch = setTimeout(() => {
      clearInterval(interval)
      throw new Error('You got too fancy')
    }, 100)
  })
}

class SlotchangeWorkflow extends Shadowbind.Element {
  async getActual () {
    let tests = []
    const single = this.shadowRoot.querySelector('test-single-slot')
    const multi = this.shadowRoot.querySelector('test-multiple-slots')

    tests.push(await waitForData('H1', single.result))
    this.data({ test1: 'h2', 'test2:1': null, 'test2:2': null })
    tests.push(await waitForData('H2', single.result))

    tests.push(await waitForData('H3', multi.result1))
    tests.push(await waitForData('H4', multi.result2))
    this.data({ 'test2:1': 'h5', 'test2:2': 'h6' })
    tests.push(await waitForData('H5', multi.result1))
    tests.push(await waitForData('H6', multi.result2))

    return tests
  }
  async getExpected () {
    return ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
  }
  template () {
    return /* @html */`
      <test-single-slot>
        <h1 :tag="test1"></h1>
      </test-single-slot>
      <test-multiple-slots>
        <h3 :tag="test2:1" slot="slot1"></h3>
        <h4 :tag="test2:2" slot="slot2"></h4>
      </test-multiple-slots>
    `
  }
}

class TestSingleSlot extends Shadowbind.Element {
  constructor () {
    super()
    this.result = () => {
      return this.slot
    }
  }
  onSlotchange (event) {
    this.slot = event.target.assignedElements()[0].tagName
  }
  template () {
    return /* @html */`
      <slot on:slotchange="onSlotchange"></slot>
    `
  }
}

class TestMultipleSlots extends Shadowbind.Element {
  constructor () {
    super()
    this.result1 = () => {
      return this.slot1
    }
    this.result2 = () => {
      return this.slot2
    }
  }
  onSlotchange (event) {
    this[event.target.name] = event.target.assignedElements()[0].tagName
  }
  template () {
    return /* @html */`
      <div on:slotchange="onSlotchange">
        <h3><slot name="slot1"></slot></h3>
        <h3><slot name="slot2"></slot></h3>
      </div>
    `
  }
}

Shadowbind.define({ SlotchangeWorkflow, TestSingleSlot, TestMultipleSlots })
