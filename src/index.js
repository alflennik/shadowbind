import store from './reducers'
import { publish } from '../lib/domino'
import './ui-counter'
// import './ui-headline'

function stateSerializer (state) {
  // state.friends = [
  //   { id: 1, name: 'Alex', title: 'webdev' },
  //   { id: 2, name: 'Agatha', title: 'educator', final: 'final' }
  // ]
  return state
}

publish(stateSerializer(store.getState()))
store.subscribe(() => publish(stateSerializer(store.getState())))
