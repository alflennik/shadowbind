// Import all components that we want to test
import './components/test-bind'

// Send the component's getActual() and getExpected() results to tests.js
let component
const testWrap = document.querySelector('#test-wrap')
const currentComponent = window.location.hash.substr(1)
const button = document.querySelector('#start-test')

async function getActual () {
  if (!currentComponent) return
  component = document.createElement(currentComponent)
  component.setAttribute('id', 'test')
  component.style.display = 'none'
  testWrap.insertBefore(component, null)

  if (typeof component.getActual !== 'function') {
    testWrap.innerHTML = 'Did you remember to import the component?'
    throw new Error('Did you remember to import the component?')
  }
  return component.getActual()
}
async function getExpected () {
  if (!currentComponent) return
  return component.getExpected()
}

button.addEventListener('click', async () => {
  await getActual()
  await getExpected()
})
