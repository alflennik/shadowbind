import Shadowbind from '../../../src/index.js'

function tryToDefine (componentAndName) {
  try {
    Shadowbind.define(componentAndName)
  } catch (err) {
    return err.code || err.message
  }
  return 'no errors'
}

class ComponentNames extends Shadowbind.Element {
  getActual () {
    let tests = []
    tests.push(tryToDefine({ 'singleword': ValidComponent }))
    tests.push(tryToDefine({ '-element': ValidComponent }))
    tests.push(tryToDefine({ 'element--name': ValidComponent }))
    tests.push(tryToDefine({ 'Single': ValidComponent }))
    tests.push(tryToDefine({ capitalization_component: ValidComponent }))
    tests.push(tryToDefine({ camelComponent: ValidComponent }))
    return tests
  }
  getExpected () {
    return [
      'shadowbind_component_name',
      'shadowbind_component_name',
      'shadowbind_component_name',
      'shadowbind_component_name',
      'shadowbind_component_name',
      'shadowbind_component_name'
    ]
  }
}

class ValidComponent extends Shadowbind.Element {}

Shadowbind.define({ ComponentNames })
