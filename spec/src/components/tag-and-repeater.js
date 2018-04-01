import define from '../../../src/index.js'

class TagAndRepeater extends window.HTMLElement {
  getActual () {
    this.publish({ tag: 'tag-repeater-component', myData: [1, 2] })
    const elements = this.shadowRoot.querySelectorAll('.repeatedElement')
    let tagNames = []
    for (const element of elements) {
      tagNames.push(element.tagName.toLowerCase())
    }
    return tagNames
  }
  getExpected () {
    return ['tag-repeater-component', 'tag-repeater-component']
  }
  template () {
    return /* @html */`
      <div :tag="tag" :publish="myData" class="repeatedElement"></div>
    `
  }
}

class TagRepeaterComponent extends window.HTMLElement {
  template () {
    return ''
  }
}

define(TagAndRepeater)
define(TagRepeaterComponent)
