import publish from './publish.js'

export default store => {
  publish(store.getState())
  return next => action => {
    next(action)
    publish(store.getState())
  }
}
