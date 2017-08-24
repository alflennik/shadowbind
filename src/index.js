import store from './reducers'
import { publish } from '../lib/domino'
import './ui-counter'
import './ui-headline'

publish(store.getState())
store.subscribe(() => publish(store.getState()))
