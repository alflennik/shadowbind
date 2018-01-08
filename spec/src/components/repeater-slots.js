import { subscribe, publish } from '../../../src/index.js'

class RepeaterSlots extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <repeated-slot-element :for="items" class="loop">
      <h2 :text="text" class="slotted"></h2>
    </repeated-slot-element>`
  }

  async getExpected () {
    return ['should use outer', 'should use outer', 'should use outer']
  }

  async getActual () {
    publish({ items: [1, 2, 3], text: 'should use outer' })
    const r = this.shadowRoot

    return [
      r.querySelector('repeated-slot-element:nth-child(1) .slotted').innerText,
      r.querySelector('repeated-slot-element:nth-child(2) .slotted').innerText,
      r.querySelector('repeated-slot-element:nth-child(3) .slotted').innerText
    ]
  }
}

class RepeatElement extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <slot></slot>`
  }
  bind (state) {
    return { text: 'should NOT use inner' }
  }
}

window.customElements.define('repeater-slots', RepeaterSlots)
window.customElements.define('repeated-slot-element', RepeatElement)
