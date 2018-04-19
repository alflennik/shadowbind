import { combineReducers, createStore, applyMiddleware } from 'redux'
import Shadowbind from '../../dist/shadowbind'
import counter from './reducers/counter'

const rootReducer = combineReducers({ counter })

export default createStore(
  rootReducer,
  applyMiddleware(Shadowbind.redux)
)
