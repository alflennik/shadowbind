import Shadowbind from '../../../src/index.js'

class FormsImperative extends window.HTMLElement {
  getActual () {
    this.form({
      textField: 'textValue',
      emailField: 'value@gmail.com',
      numberField: 200,
      selectField: 's2',
      multiSelectField: ['m2', 'm3', 'm4'],
      radioField: 'r3',
      checkboxField: ['c3', 'c4'],
      checkboxCheckAll: true,
      checkboxSingle: true,
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
      checkboxField: ['c3', 'c4'],
      checkboxCheckAll: ['cc1', 'cc2'],
      checkboxSingle: true,
      textareaField: 'abc123'
    }
  }
  template () {
    return /* @html */`
      <form>
        <div>
          <input type="text" name="textField">
          <input type="email" name="emailField">
          <input type="number" name="numberField">
        </div>

        <select name="selectField">
          <option value="s1">S1</option>
          <option value="s2">S2</option>
          <option value="s2">S2</option>
        </select>

        <span name="weirdlyHasANameValue">
          <select name="multiSelectField" multiple>
            <option value="m1">M1</option>
            <option value="m2">M2</option>
            <option value="m3">M3</option>
            <option value="m4">M4</option>
          </select>
        </span>

        <input type="radio" name="radioField" value="r1">
        <input type="radio" name="radioField" value="r2">
        <input type="radio" name="radioField" value="r3">

        <input type="checkbox" name="checkboxField" value="c1">
        <input type="checkbox" name="checkboxField" value="c2">
        <input type="checkbox" name="checkboxField" value="c3">
        <input type="checkbox" name="checkboxField" value="c4">
        <input type="checkbox" name="checkboxField" value="c5">

        <input type="checkbox" name="checkboxCheckAll" value="cc1">
        <input type="checkbox" name="checkboxCheckAll" value="cc2">

        <input type="checkbox" name="checkboxSingle">

        <textarea name="textareaField"></textarea>
      </form>
      <input type="text" name="disregardedField">
    `
  }
}

Shadowbind.define(FormsImperative)
