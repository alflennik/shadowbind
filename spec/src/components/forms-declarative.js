import Shadowbind from '../../../src/index.js'

class FormsDeclarative extends window.HTMLElement {
  getActual () {
    this.data({
      textField: 'textValue',
      emailField: 'value@gmail.com',
      numberField: 200,
      selectField: 's2',
      multiSelectField: ['m2', 'm3', 'm4'],
      radioField: 'r3',
      checkField: ['c3', 'c4'],
      textareaField: 'abc123'
    })

    return this.form()
  }
  getExpected () {
    return {
      textField: 'textValue',
      emailField: 'value@gmail.com',
      numberField: 200,
      selectField: 's2',
      multiSelectField: ['m2', 'm3', 'm4'],
      radioField: 'r3',
      checkField: ['c3', 'c4'],
      textareaField: 'abc123'
    }
  }
  template () {
    return /* @html */`
      <form>
        <div>
          <input type="text" name="textField" :value="textField">
          <input type="email" name="emailField" :value="emailField">
          <input type="number" name="numberField" :value="numberField">
        </div>

        <select name="selectField" :value="selectField">
          <option value="s1">S1</option>
          <option value="s2">S2</option>
          <option value="s2">S2</option>
        </select>

        <span name="weirdlyHasANameField">
          <select name="multiSelectField" multiple :value="multiSelectField">
            <option value="m1">M1</option>
            <option value="m2">M2</option>
            <option value="m3">M3</option>
            <option value="m4">M4</option>
          </select>
        </span>

        <input type="radio" name="radioField" value="r1" :value="radioField">
        <input type="radio" name="radioField" value="r2" :value="radioField">
        <input type="radio" name="radioField" value="r3" :value="radioField">

        <input type="checkbox" name="checkField" value="c1" :value="checkField">
        <input type="checkbox" name="checkField" value="c2" :value="checkField">
        <input type="checkbox" name="checkField" value="c3" :value="checkField">
        <input type="checkbox" name="checkField" value="c4" :value="checkField">
        <input type="checkbox" name="checkField" value="c5" :value="checkField">

        <textarea name="textareaField" :value="textareaField"></textarea>
      </form>
      <input type="text" name="disregardedField">
    `
  }
}

Shadowbind.define(FormsDeclarative)
