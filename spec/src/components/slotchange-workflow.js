import Shadowbind from '../../../src/index.js'

class SlotchangeWorkflow extends Shadowbind.Element {
  getActual () {
    let tests = []
    const single = this.shadowRoot.querySelector('test-single-slot')
    const multi = this.shadowRoot.querySelector('test-multiple-slots')

    tests.push(single.result)
    this.data({ test1: 'h2', 'test2:1': null, 'test2:2': null })
    debugger
    tests.push(single.result)

    tests.push(multi.slot1)
    tests.push(multi.slot2)
    this.data({ 'test2:1': 'h5', 'test2:2': 'h6' })
    tests.push(multi.slot1)
    tests.push(multi.slot2)

    return tests
  }
  getExpected () {
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
    this.data({}) // :(
  }
  onSlotchange (event) {
    console.log('onSlotchange', event.target.assignedElements()[0].tagName)
    this.result = event.target.assignedElements()[0].tagName
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
    this.data({}) // :(
  }
  onSlotchange (event) {
    const slotName = event.target.getAttribute('name')
    this[slotName] = event.target.assignedElements()[0].tagName
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
