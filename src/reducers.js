import { createStore, combineReducers } from 'redux'

function counter (state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

function headline (state = { color: '#444', boldness: 100 }, action) {
  switch (action.type) {
    case 'TOGGLE_COLOR':
      const color = state.color !== 'coral' ? 'coral' : 'red'
      return { boldness: state.boldness, color }
    case 'MAKE_BOLDER':
      let boldness = state.boldness + 100
      if (boldness > 900) boldness = 100
      return { color: state.color, boldness }
    default:
      return state
  }
}

const defaultFriends = [
  {
    id: 1,
    name: 'Alex',
    job: 'Web Developer',
    description: 'Yo1',
    email: 'a@flennik.com'
  },
  {
    id: 2,
    name: 'Anya',
    job: 'SQL Pro',
    description: 'Yo2',
    email: 'anya.deleon@gmail.com'
  },
  {
    id: 3,
    name: 'Zohal',
    job: 'Pharmacist',
    description: 'Yo3',
    email: 'zohal.sawary@gmail.com'
  }
]
function friends (state = defaultFriends, action) {
  return state
}

const rootReducer = combineReducers({ counter, headline, friends })

let store = createStore(rootReducer)

export default store
