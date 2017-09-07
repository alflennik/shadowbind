class TestBind extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
  }

  attachedCallback () {

  }
}

window.customElements.define('test-bind', TestBind)
