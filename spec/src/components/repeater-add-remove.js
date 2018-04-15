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

class RepeaterAddRemove extends window.HTMLElement {
  template () {
    return /* @html */`<id-list :publish="idList"></id-list>`
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
    this.publish({ idList: ['a', 'b', 'c', 'd'] })
    attempts.attempt1 = readIdList()
    this.publish({ idList: ['b', 'c'] })
    attempts.attempt2 = readIdList()
    this.publish({ idList: ['c', 'b', 'a'] })
    attempts.attempt3 = readIdList()
    this.publish({ idList: [] })
    attempts.attempt4 = readIdList()
    this.publish({ idList: ['a', 'b', 'c', 'd', 'e'] })
    attempts.attempt5 = readIdList()
    return attempts
  }
}

class IdList extends window.HTMLElement {
  template () {
    return /* @html */`<h2 attr:id="id"></h2>`
  }
  bind (state) {
    return { id: state }
  }
}

Shadowbind.define(RepeaterAddRemove)
Shadowbind.define(IdList)
