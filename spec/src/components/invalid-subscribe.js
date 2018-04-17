import Shadowbind from '../../../src/index.js'

function tryDefine(Component) {
  try {
    Shadowbind.define(Component)
  } catch (err) {
    return err.code || err.message
  }
  return 'no errors'
}

class InvalidSubscribe extends window.HTMLElement {
  getActual () {
    return [
      tryDefine(InvalidSubscribe1),
      tryDefine(InvalidSubscribe2),
      tryDefine(InvalidSubscribe3),
      tryDefine(InvalidSubscribe4),
    ]
  }
  getExpected () {
    return [
      'shadowbind_invalid_subscribe',
      'shadowbind_invalid_subscribe',
      'shadowbind_subscribe_callback',
      'shadowbind_subscribe_watch_key'
    ]
  }
}

class InvalidSubscribe1 extends window.HTMLElement {
  subscribe() {
    return { attr: 'propertyName' }
  }
}

class InvalidSubscribe2 extends window.HTMLElement {
  subscribe() {
    return { myKey: true }
  }
}

class InvalidSubscribe3 extends window.HTMLElement {
  subscribe() {
    return { myKey: { attr: 'my-key', callback: true } }
  }
}

class InvalidSubscribe4 extends window.HTMLElement {
  subscribe() {
    return { myKey: { attr: true } }
  }
}

Shadowbind.define(InvalidSubscribe)
