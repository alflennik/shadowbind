import Shadowbind from '../../../src/index.js'

class TagAndRepeater extends Shadowbind.Element {
  getActual () {
    this.data({ tag: 'tag-repeater-component', myData: [1, 2] })
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
      <div :tag="tag" :map="myData" class="repeatedElement"></div>
    `
  }
}

class TagRepeaterComponent extends Shadowbind.Element {
  template () {
    return ''
  }
}

Shadowbind.define(TagAndRepeater)
Shadowbind.define(TagRepeaterComponent)
