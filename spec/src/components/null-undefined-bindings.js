import Shadowbind from '../../../src/index.js'

class NullUndefinedBindings extends Shadowbind.Element {
  getActual () {
    let tests = []
    tests.push(this.test({ myText: undefined }))
    tests.push(this.test({ myCondition: undefined }))
    tests.push(this.test({ shouldShow: undefined }))
    tests.push(this.test({ tagName: undefined }))
    tests.push(this.test({ myValue: undefined }))
    tests.push(this.test({ myAttrValue: undefined }))
    tests.push(this.test({ myClass: undefined }))
    tests.push(this.test({ myHeight: undefined }))
    tests.push(this.test({ myArray: undefined }))
    tests.push(this.test({ myText: null }))
    tests.push(this.test({ myCondition: null }))
    tests.push(this.test({ shouldShow: null }))
    tests.push(this.test({ tagName: null }))
    tests.push(this.test({ myValue: null }))
    tests.push(this.test({ myAttrValue: null }))
    tests.push(this.test({ myClass: null }))
    tests.push(this.test({ myHeight: null }))
    tests.push(this.test({ myArray: null }))
    return tests
  }
  getExpected () {
    return new Array(18).fill('no errors')
  }
  test (data) {
    try {
      this.data(data)
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
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
