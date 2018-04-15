import Shadowbind from '../../../src/index.js'

class SetFormDeclarative extends window.HTMLElement {
  getActual () {
    // typeIntoField('textValue')

    this.publish({
      emailField: 'value@gmail.com',
      numberField: 200,
      selectField: 's2',
      multiSelectField: ['m2', 'm3', 'm4'],
      radioField: 'r3',
      checkboxField: ['c3', 'c4'],
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
      textareaField: 'abc123'
    }
  }
  onInput () {
    console.log(this.form())
    // this.publish(this.form())
  }
  template () {
    return /* @html */`
      <form on:input="onInput">
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

        <input type="radio" name="radioField" :value="radioField">
        <input type="radio" name="radioField" :value="radioField">
        <input type="radio" name="radioField" :value="radioField">

        <input type="checkbox" name="checkboxField" :value="checkboxField">
        <input type="checkbox" name="checkboxField" :value="checkboxField">
        <input type="checkbox" name="checkboxField" :value="checkboxField">
        <input type="checkbox" name="checkboxField" :value="checkboxField">
        <input type="checkbox" name="checkboxField" :value="checkboxField">

        <textarea name="textareaField"></textarea>
      </form>
      <input type="text" name="disregardedField">
    `
  }
}

Shadowbind.define(SetFormDeclarative)
