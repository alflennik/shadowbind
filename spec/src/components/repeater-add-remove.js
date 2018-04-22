import Shadowbind from '../../../src/index.js'

function readIdList () {
  const repeatShadow = document.querySelector('repeater-add-remove').shadowRoot
  let idList = []
  const repeatElements = repeatShadow.querySelectorAll('id-list')
  for (const repeatElement of repeatElements) {
    idList.push(repeatElement.shadowRoot.querySelector('h2').getAttribute('id'))
  }
  return idList
}

class RepeaterAddRemove extends Shadowbind.Element {
  template () {
    return /* @html */`<id-list :map="idList"></id-list>`
  }
  async getExpected () {
    return {
      attempt1: ['a', 'b', 'c', 'd'],
      attempt2: ['b', 'c'],
      attempt3: ['c', 'b', 'a'],
      attempt4: [],
      attempt5: ['a', 'b', 'c', 'd', 'e']
    }
  }
  async getActual () {
    let attempts = {}
    this.data({ idList: ['a', 'b', 'c', 'd'] })
    attempts.attempt1 = readIdList()
    this.data({ idList: ['b', 'c'] })
    attempts.attempt2 = readIdList()
    this.data({ idList: ['c', 'b', 'a'] })
    attempts.attempt3 = readIdList()
    this.data({ idList: [] })
    attempts.attempt4 = readIdList()
    this.data({ idList: ['a', 'b', 'c', 'd', 'e'] })
    attempts.attempt5 = readIdList()
    return attempts
  }
}

class IdList extends Shadowbind.Element {
  template () {
    return /* @html */`<h2 attr:id="id"></h2>`
  }
  bindings (state) {
    return { id: state }
  }
}

Shadowbind.define({ RepeaterAddRemove })
Shadowbind.define({ IdList })
