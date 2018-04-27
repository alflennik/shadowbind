import Shadowbind from '../../../src/index.js'

async function tryToDefine (componentAndName) {
  try {
    await Shadowbind.define(componentAndName)
  } catch (err) {
    return err.code || err.message
  }
  return 'no errors'
}

class ComponentNames extends Shadowbind.Element {
  async getActual () {
    let tests = []
    tests.push(await tryToDefine({ 'singleword': ValidComponent }))
    tests.push(await tryToDefine({ '-element': ValidComponent }))
    tests.push(await tryToDefine({ 'element--name': ValidComponent }))
    tests.push(await tryToDefine({ 'Single': ValidComponent }))
    tests.push(await tryToDefine({ capitalization_component: ValidComponent }))
    tests.push(await tryToDefine({ camelComponent: ValidComponent }))
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
