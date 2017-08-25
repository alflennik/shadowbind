import store from './reducers'
import { publish } from '../lib/domino'
import './ui-counter'
import './ui-headline'
import './ui-friends'

publish(store.getState())
store.subscribe(() => publish(store.getState()))
