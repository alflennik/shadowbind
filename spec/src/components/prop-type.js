import { define } from '../../../src/index.js'

class WrongPropType extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    this.notFunction = 'a string'
  }
}

class PropType extends HTMLElement { // eslint-disable-line
  template () {
    return /* @html */`
      <wrong-prop-type prop:not-function="someData"></wrong-prop-type>
    `
  }
  getActual () {
    try {
      this.publish({ someData: {} })
    } catch (err) {
      return err.code || err.message
    }
    return 'no errors'
  }
  getExpected () {
    return 'shadowbind_prop_type'
  }
}

define(PropType)
define(WrongPropType)
