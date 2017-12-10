import error from './error'
import applyDots from './applyDots'
import getType from '../util/getType'

export default function applyStateKey (state, stateKey) {
  if (stateKey === undefined) return state

  if (getType(stateKey) !== 'string') {
    error(
      'shadowbind_subscribe_key_type',
      `The key ${JSON.stringify(stateKey)} must be a string, but it was ` +
        `"${getType(stateKey)}"`
    )
  }

  if (!/^[^.].+[^.]$/.test(stateKey)) { // cannot begin or end with dot
    error(
      'shadowbind_subscribe_key_invalid',
      `The key "${stateKey}" could not be parsed`
    )
  }

  if (stateKey.indexOf('.') === -1) {
    if (!Object.keys(state).includes(stateKey)) {
      error(
        'shadowbind_subscribe_key_not_found',
        `The key "${stateKey}" could not be found in the published state`
      )
    }
  }

  return applyDots(
    state,
    stateKey,
    'state',
    'published state',
    'shadowbind_subscribe_key_not_found'
  )
}
