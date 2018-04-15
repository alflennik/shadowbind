import Shadowbind from '../../../src/index.js'

class DefineType extends HTMLElement { // eslint-disable-line
  getActual () {
    window.ready = true
    let tests = []

    try {
      Shadowbind.define()
    } catch (err) {
      tests.push(err.code || err.message)
    }

    try {
      Shadowbind.define({ just: 'a plain object' })
    } catch (err) {
      tests.push(err.code || err.message)
    }

    try {
      Shadowbind.define(document.createElement('div'))
    } catch (err) {
      tests.push(err.code || err.message)
    }

    return tests
  }
  getExpected () {
    return [
      'shadowbind_define_without_arguments',
      'shadowbind_define_type',
      'shadowbind_define_type'
    ]
  }
}

Shadowbind.define(DefineType)
