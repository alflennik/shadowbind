import publish from './publish'

export default store => {
  publish(store.getState())
  return next => action => {
    next(action)
    publish(store.getState())
  }
}
