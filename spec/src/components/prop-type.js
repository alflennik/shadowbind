import Shadowbind from '../../../src/index.js'

class WrongPropType extends Shadowbind.Element {
  constructor () {
    super()
    this.notFunction = 'a string'
  }
}

class PropType extends Shadowbind.Element {
  getActual () {
    try {
      this.data({ someData: {} })
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_prop_type'
  }
  template () {
    return /* @html */`
      <wrong-prop-type prop:not-function="someData"></wrong-prop-type>
    `
  }
}

Shadowbind.define({ PropType })
Shadowbind.define({ WrongPropType })
