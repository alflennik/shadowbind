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
      attempt5: ['a', 'b', 'c', 'e']
    }
  }
  async getActual () {
    let attempts = {}
    this.data({ idList: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }] })
    attempts.attempt1 = readIdList()
    this.data({ idList: [{ id: 'b' }, { id: 'c' }] })
    attempts.attempt2 = readIdList()
    this.data({ idList: [{ id: 'c' }, { id: 'b' }, { id: 'a' }] })
    attempts.attempt3 = readIdList()
    this.data({ idList: [] })
    attempts.attempt4 = readIdList()
    this.data({ idList: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'e' }] })
    attempts.attempt5 = readIdList()
    return attempts
  }
}

class IdList extends Shadowbind.Element {
  template () {
    return /* @html */`<h2 attr:id="id"></h2>`
  }
}

Shadowbind.define({ RepeaterAddRemove, IdList })
