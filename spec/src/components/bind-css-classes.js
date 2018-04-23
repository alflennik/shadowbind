import Shadowbind from '../../../src/index.js'

class BindCssClasses extends Shadowbind.Element {
  getActual () {
    this.data({
      added: true,
      truthy: 'a string is truthy',
      remove: false,
      twoWords: true,
      withOthers: true
    })

    const el = this.shadowRoot
    return {
      added: el.querySelector('#add').classList.contains('added'),
      truthy: el.querySelector('#truthy').classList.contains('truthy'),
      remove: el.querySelector('#remove').classList.contains('remove'),
      twoWords: el.querySelector('#twoWords').classList.contains('two-words'),
      remains: el.querySelector('#withOthers').classList.contains('remains')
    }
  }
  getExpected () {
    return {
      added: true,
      truthy: true,
      remove: false,
      twoWords: true,
      remains: true
    }
  }
  template () {
    return /* @html */ `
      <div class:added="added" id="add"></div>
      <div class:truthy="truthy" id="truthy"></div>
      <div class:removed="remove" id="remove"></div>
      <div class:two-words="twoWords" id="twoWords"></div>
      <div class="remains" class:with-others="withOthers" id="withOthers"></div>
    `
  }
}

Shadowbind.define({ BindCssClasses })
