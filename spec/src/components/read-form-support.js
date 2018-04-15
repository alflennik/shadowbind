import Shadowbind from '../../../src/index.js'

class ReadFormSupport extends window.HTMLElement {
  getActual () {
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
      checkboxField: ['c3', 'c4'],
      textareaField: 'abc123'
    }
  }
  template () {
    return /* @html */`
      <form>
        <div>
          <input type="text" name="textField" value="textValue">
          <input type="email" name="emailField" value="value@gmail.com">
          <input type="number" name="numberField" value="200">
        </div>

        <select name="selectField">
          <option value="s1">S1</option>
          <option value="s2" selected>S2</option>
          <option value="s2">S2</option>
        </select>

        <span name="weirdlyHasANameValue">
          <select name="multiSelectField" multiple>
            <option value="m1">M1</option>
            <option value="m2" selected>M2</option>
            <option value="m3" selected>M3</option>
            <option value="m4" selected>M4</option>
          </select>
        </span>

        <input type="radio" name="radioField" value="r1">
        <input type="radio" name="radioField" value="r2">
        <input type="radio" name="radioField" value="r3" checked>

        <input type="checkbox" name="checkboxField" value="c1">
        <input type="checkbox" name="checkboxField" value="c2">
        <input type="checkbox" name="checkboxField" value="c3" checked>
        <input type="checkbox" name="checkboxField" value="c4" checked>
        <input type="checkbox" name="checkboxField" value="c5">

        <textarea name="textareaField">abc123</textarea>
      </form>
      <input type="text" name="disregardedField">
    `
  }
}

Shadowbind.define(ReadFormSupport)
