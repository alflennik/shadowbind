import Shadowbind from '../../../src/index.js'

class DefineType extends Shadowbind.Element {
  async getActual () {
    let tests = []

    try {
      await Shadowbind.define()
    } catch (err) {
      tests.push(err.code || err.message)
    }

    try {
      await Shadowbind.define({ 'a-plain-object': { just: 'a plain object' } })
    } catch (err) {
      tests.push(err.code || err.message)
    }

    try {
      await Shadowbind.define({ 'my-div': document.createElement('div') })
    } catch (err) {
      tests.push(err.code || err.message)
    }

    try {
      await Shadowbind.define({ 'my-function': () => {} })
    } catch (err) {
      tests.push(err.code || err.message)
    }

    try {
      class ValidWebComponent extends window.HTMLElement {}
      await Shadowbind.define({ ValidWebComponent })
    } catch (err) {
      tests.push(err.code || err.message)
    }

    return tests
  }
  getExpected () {
    return [
      'shadowbind_define_without_arguments',
      'shadowbind_define_type',
      'shadowbind_define_type',
      'shadowbind_define_type',
      'shadowbind_define_type'
    ]
  }
}

Shadowbind.define({ DefineType })
