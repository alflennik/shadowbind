let currentRepeaterKey = 0
let currentRepeaters = {}

function initializeRepeat (example) {
  currentRepeaterKey++
  const parent = example.parentNode
  const repeatId = setRepeatId(example)

  currentRepeaters[repeatId] = {
    parent,
    loopKey: example.getAttribute(':for'),
    uniqueId: example.getAttribute(':key'),
    example: (() => {
      parent.removeChild(example)
      example.removeAttribute(`:for`)
      example.removeAttribute(`:key`)
      return example
    })()
  }
  return repeatId
}

function applyRepeat (repeatId, prependElement, localBindings) {
  currentRepeaterKey++
  const { loopKey, uniqueId, parent, example } = currentRepeaters[repeatId]

  let currentItems
  if (repeatId) {
    currentItems = els(`[${repeatId}]`, parent).reduce((acc, el) => {
      return acc.concat(el.getAttribute('key'))
    }, [])
  } else {
    currentItems = []
  }

  for (const item of localBindings[loopKey]) {
    let element
    if (currentItems.includes(item[uniqueId] + '')) {
      element = el(`[key="${item[uniqueId]}"][${repeatId}]`)
    } else {
      element = example.cloneNode(true)
    }

    parent.insertBefore(element, prependElement)
    element.innerHTML = item.name
    element.setAttribute('key', item[uniqueId])
    setRepeatId(element)
  }

  const newRepeatId = setRepeatId(example)
  if (repeatId) els(`[${repeatId}]`).map(item => parent.removeChild(item))
  if (els(`[${newRepeatId}]`).length === 0) {
    let placeholder = document.createElement('span')
    placeholder.setAttribute('sb:repeat', '')
    setRepeatId(placeholder)
    parent.insertBefore(placeholder, prependElement)
  }
  currentRepeaters[newRepeatId] = currentRepeaters[repeatId]
  delete currentRepeaters[repeatId]
}

function setRepeatId (element, type) {
  let repeaterKey = `r${currentRepeaterKey}`
  for (let attr of element.attributes) {
    if (!attr.name) continue
    let match = /^(r\d+)$/.exec(attr.name)
    if (match) element.removeAttribute(attr.name)
  }
  element.setAttribute(repeaterKey, '')
  return repeaterKey
}

function getRepeatId (element) {
  for (let attr of element.attributes) {
    if (!attr.name) continue
    let match = /^(r\d+)$/.exec(attr.name)
    if (match) return attr.name
  }
}

let data = {
  simpsons: [
    { id: 0, name: 'homer' },
    { id: 1, name: 'marge' },
    { id: 2, name: 'bart' },
    { id: 3, name: 'lisa' },
    { id: 4, name: 'maggie' }
  ]
}

let data2 = {
  simpsons: [
    { id: 0, name: 'Homer' },
    { id: 1, name: 'Marge' },
    { id: 2, name: 'Bart' },
    { id: 3, name: 'Lisa' },
    { id: 4, name: 'Maggie' }
  ]
}

let compassData = {
  compass: [
    { id: 0, name: 'Lyra' },
    { id: 1, name: 'Roger' },
    { id: 2, name: 'Lord Asriel' },
    { id: 3, name: 'Miss Coulter' },
    { id: 4, name: 'Master' },
    { id: 5, name: 'Librarian' }
  ]
}

let compassData2 = {
  compass: [
    { id: 0, name: 'Lyra' },
    { id: 2, name: 'Lord Asriel' },
    { id: 3, name: 'Miss Coulter' },
    { id: 6, name: 'Aliethometer' }
  ]
}

function el (selector, context = document) {
  selector = selector.replace(':', '\\:') // eslint-disable-line
  return context.querySelector(selector)
}

const els = (selector, context = document) => {
  return Array.prototype.slice.call(
    context.querySelectorAll(selector)
  )
}

const simpsons = initializeRepeat(el('[simpsons]'))
const compass = initializeRepeat(el('[compass]'))
applyRepeat(simpsons, el('[compass-header]'), data)
applyRepeat(compass, null, compassData)
applyRepeat(getRepeatId(el('[simpsons]')), el('[compass-header]'), data2)

function shuffle (localBindings, loopKey) {
  let array = localBindings[loopKey]
  let currentIndex = array.length
  let temporaryValue
  let randomIndex
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  localBindings[loopKey] = array
  return localBindings
}

let toggleData
el('[toggle-data]').addEventListener('click', () => {
  toggleData = toggleData === data ? data2 : data
  applyRepeat(getRepeatId(el('[simpsons]')), el('[compass-header]'), toggleData)
})

el('[randomize]').addEventListener('click', () => {
  toggleData = toggleData || data
  applyRepeat(getRepeatId(el('[simpsons]')), el('[compass-header]'), shuffle(toggleData, 'simpsons'))
})

el('[update]').addEventListener('click', () => {
  const idElement = el('[compass]') || el('[sb:repeat]')
  applyRepeat(getRepeatId(idElement), null, compassData2)
})

el('[empty]').addEventListener('click', () => {
  applyRepeat(getRepeatId(el('[compass]')), null, { compass: [] })
})
