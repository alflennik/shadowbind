import Shadowbind from '../../../src/index.js'

class NullUndefinedBindings extends Shadowbind.Element {
  getActual () {
    let tests = []
    tests.push(this.test({ myText: undefined }))
    tests.push(this.test({ myText: null, myCondition: undefined }))
    tests.push(this.test({ myCondition: null, shouldShow: undefined }))
    tests.push(this.test({ shouldShow: null, tagName: undefined }))
    tests.push(this.test({ tagName: null, myValue: undefined }))
    tests.push(this.test({ myValue: null, myAttrValue: undefined }))
    tests.push(this.test({ myAttrValue: null, myClass: undefined }))
    tests.push(this.test({ myClass: null, myHeight: undefined }))
    tests.push(this.test({ myHeight: null, myArray: undefined }))
    tests.push(this.test({ myArray: null }))
    return tests
  }
  getExpected () {
    let results = new Array(8).fill('shadowbind_undefined_binding')
    results.push('shadowbind_map_type')
    results.push('shadowbind_undefined_event_method')
    return results
  }
  test (data) {
    try {
      this.data(data)
    } catch (err) {
      return err.code || err.message
    }
  }
  template () {
    return /* @html */`
      <div :text="myText"></div>
      <div :if="myCondition"></div>
      <div :show="shouldShow"></div>
      <div :tag="tagName"></div>
      <input type="checkbox" :value="myValue">
      <div attr:test="myAttrValue"></div>
      <div class:a-class="myClass"></div>
      <div css:height="myHeight"></div>
      <just-another-repeater :map="myArray"></just-another-repeater>
      <button on:click="handleClick">Handle click</button>
    `
  }
}

class JustAnotherRepeater extends Shadowbind.Element {
  template () {
    return /* @html */`
      <div :text="mappedValue"></div>
    `
  }
}

Shadowbind.define({ NullUndefinedBindings, JustAnotherRepeater })
