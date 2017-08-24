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

function color (state = '#444', action) {
  switch (action.type) {
    case 'TOGGLE_COLOR':
      return state !== 'coral' ? 'coral' : 'red'
    default:
      return state
  }
}

const rootReducer = combineReducers({ counter, color })

let store = createStore(rootReducer)

export default store
