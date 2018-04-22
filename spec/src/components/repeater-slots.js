import Shadowbind from '../../../src/index.js'

class RepeaterSlots extends Shadowbind.Element {
  template () {
    return /* @html */`
      <repeated-slot-element :map="items" class="loop">
        <h2 :text="text" class="slotted"></h2>
      </repeated-slot-element>
    `
  }
  async getExpected () {
    return ['should use outer', 'should use outer', 'should use outer']
  }
  async getActual () {
    this.data({ items: [1, 2, 3], text: 'should use outer' })
    const r = this.shadowRoot

    return [
      r.querySelectorAll('repeated-slot-element .slotted')[0].innerText,
      r.querySelectorAll('repeated-slot-element .slotted')[1].innerText,
      r.querySelectorAll('repeated-slot-element .slotted')[2].innerText
    ]
  }
}

class RepeatedSlotElement extends Shadowbind.Element {
  template () {
    return /* @html */`<slot></slot>`
  }
  bindings (state) {
    return { text: 'should NOT use inner' }
  }
}

Shadowbind.define(RepeaterSlots)
Shadowbind.define(RepeatedSlotElement)
