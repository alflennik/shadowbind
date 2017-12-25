import { subscribe, publish } from '../../../src/index.js'

function readIdList () {
  const repeatShadow = document.querySelector('repeater-add-remove').shadowRoot
  let idList = []
  const repeatElements = repeatShadow.querySelectorAll('id-list')
  for (const repeatElement of repeatElements) {
    idList.push(repeatElement.shadowRoot.querySelector('h2').getAttribute('id'))
  }
  return idList
}

class RepeaterAddRemove extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this)
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <id-list :for="idList"></id-list>`
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
    publish({ idList: ['a', 'b', 'c', 'd'] })
    attempts.attempt1 = readIdList()
    publish({ idList: ['b', 'c'] })
    attempts.attempt2 = readIdList()
    publish({ idList: ['c', 'b', 'a'] })
    attempts.attempt3 = readIdList()
    publish({ idList: [] })
    attempts.attempt4 = readIdList()
    publish({ idList: ['a', 'b', 'c', 'd', 'e'] })
    attempts.attempt5 = readIdList()
    return attempts
  }
}

class IdList extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = /* @html */`
    <h2 bind:id="id"></h2>`
  }
  bind (state) {
    return { id: state }
  }
}

window.customElements.define('repeater-add-remove', RepeaterAddRemove)
window.customElements.define('id-list', IdList)
