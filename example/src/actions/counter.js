import store from '../store'

export function increment() {
  store.dispatch({ type: 'INCREMENT' })
}
