import { combineReducers, createStore, applyMiddleware } from 'redux'
import Shadowbind from '../../dist/shadowbind'
import counter from './reducers/counter'

const rootReducer = combineReducers({ counter })
const middleware = applyMiddleware(Shadowbind.redux)

export default createStore(rootReducer, middleware)
