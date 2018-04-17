import Shadowbind from '../../../src/index.js'

function tryToDefine (Component, name) {
  try {
    if (name) Shadowbind.define(name, Component)
    else Shadowbind.define(Component)
  } catch (err) {
    return err.code || err.message
  }
  return 'no errors'
}

class ComponentNames extends window.HTMLElement {
  getActual () {
    let tests = []
    tests.push(tryToDefine(ValidComponent, 'singleword'))
    tests.push(tryToDefine(ValidComponent, '-element'))
    tests.push(tryToDefine(ValidComponent, 'element--name'))
    tests.push(tryToDefine(Single))
    tests.push(tryToDefine(capitalization_component))
    return tests
  }
  getExpected () {
    return [
      'shadowbind_component_name',
      'shadowbind_component_name',
      'shadowbind_component_name',
      'shadowbind_implicit_component_name',
      'shadowbind_implicit_component_name'
    ]
  }
}

class ValidComponent extends window.HTMLElement {}
class Single extends window.HTMLElement {}
class capitalization_component extends window.HTMLElement {}
class camelComponent extends window.HTMLElement {}

Shadowbind.define(ComponentNames)
