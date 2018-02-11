import getType from '../util/getType.js'
import arrayToSentence from '../util/arrayToSentence.js'
import error from './error.js'

export default function assertType (value, types, name) {
  if (!Array.isArray(types)) types = [types]
  const actual = getType(value)

  if (types.includes(actual)) return

  const errorMessage = (() => {
    if (value === undefined) return `The ${name} cannot be undefined`
    return `The ${name} was "${actual}", but expected type ` +
      `${arrayToSentence(types.map(type => `"${type}"`))}`
  })()

  const errorCode = `shadowbind_${name.replace(/[^a-z]/g, '_')}`

  error(errorCode, errorMessage)
}
