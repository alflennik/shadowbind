import define from '../../../src/index.js'

class RepeaterSlots extends window.HTMLElement {
  template () {
    return /* @html */`
      <repeated-slot-element :for="items" class="loop">
        <h2 :text="text" class="slotted"></h2>
      </repeated-slot-element>
    `
  }
  async getExpected () {
    return ['should use outer', 'should use outer', 'should use outer']
  }
  async getActual () {
    this.publish({ items: [1, 2, 3], text: 'should use outer' })
    const r = this.shadowRoot

    return [
      r.querySelector('repeated-slot-element:nth-child(1) .slotted').innerText,
      r.querySelector('repeated-slot-element:nth-child(2) .slotted').innerText,
      r.querySelector('repeated-slot-element:nth-child(3) .slotted').innerText
    ]
  }
}

class RepeatedSlotElement extends window.HTMLElement {
  template () {
    return /* @html */`<slot></slot>`
  }
  bind (state) {
    return { text: 'should NOT use inner' }
  }
}

define(RepeaterSlots)
define(RepeatedSlotElement)
