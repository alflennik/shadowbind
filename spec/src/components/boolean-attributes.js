import Shadowbind from '../../../src/index.js'

class BooleanAttributes extends Shadowbind.Element {
  getActual () {
    this.data({
      isChecked: true,
      notChecked: false
    })
    return [
      this.shadowRoot.querySelector('.test1').getAttribute('checked'),
      this.shadowRoot.querySelector('.test2').getAttribute('checked')
    ]
  }
  getExpected () {
    return ['', null]
  }
  template () {
    return /* @html */`
      <div class="test1" attr:checked="isChecked"></div>
      <div class="test2" attr:checked="notChecked"></div>
    `
  }
}

Shadowbind.define({ BooleanAttributes })
