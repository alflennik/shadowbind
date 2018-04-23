import Shadowbind from '../../../src/index.js'

function tryDefine (Component) {
  try {
    Shadowbind.define({ 'invalid-subscribe': Component })
  } catch (err) {
    return err.code || err.message
  }
  return 'no errors'
}

class InvalidSubscribe extends Shadowbind.Element {
  getActual () {
    return [
      tryDefine(InvalidSubscribe1),
      tryDefine(InvalidSubscribe2),
      tryDefine(InvalidSubscribe3),
      tryDefine(InvalidSubscribe4)
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

class InvalidSubscribe1 extends Shadowbind.Element {
  subscribe () {
    return { attr: 'propertyName' }
  }
}

class InvalidSubscribe2 extends Shadowbind.Element {
  subscribe () {
    return { myKey: true }
  }
}

class InvalidSubscribe3 extends Shadowbind.Element {
  subscribe () {
    return { myKey: { attr: 'my-key', callback: true } }
  }
}

class InvalidSubscribe4 extends Shadowbind.Element {
  subscribe () {
    return { myKey: { attr: true } }
  }
}

Shadowbind.define({ InvalidSubscribe })
