// Send the component's getActual() and getExpected() results to tests.js
let component
const componentName = window.location.hash.substr(1)
const message = document.querySelector('#message')
const expected = document.querySelector('#expected')
const actual = document.querySelector('#actual')
if (componentName) message.innerHTML = ''

async function getActual () {
  if (!componentName) return
  const testWrap = document.querySelector('#test-wrap')
  testWrap.innerHTML = `<${componentName} id="test"></${componentName}>`
  component = document.querySelector(componentName)

  if (typeof component.getActual !== 'function') {
    message.innerHTML = 'Did you remember to import the component?'
    throw new Error('Did you remember to import the component?')
  }
  return component.getActual()
}

async function getExpected () {
  if (!componentName) return
  return component.getExpected()
}

document.querySelector('#start-test').addEventListener('click', async () => {
  const actualJson = JSON.stringify(await getActual())
  const expectedJson = JSON.stringify(await getExpected())
  actual.innerHTML = actualJson
  expected.innerHTML = expectedJson
  if (actualJson === expectedJson) applyPassed()
  else applyFailed()
})

function applyPassed () {
  expected.style.border = '3px solid #9dff50'
  actual.style.border = '3px solid #9dff50'
}
function applyFailed () {
  expected.style.border = '3px solid #ff5050'
  actual.style.border = '3px solid #ff5050'
}
