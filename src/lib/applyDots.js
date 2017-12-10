import { trace } from '../globals' // eslint-disable-line
import error from './error'

export default function applyDots (baseData, key, baseName, errorSource, errorCode) {
  trace.search = [[`${baseName}:`, baseData]]
  let search = baseData
  let keySearch = baseName

  for (const keyPart of key.split('.')) {
    keySearch = `${keySearch}.${keyPart}`
    if (!Object.keys(search).includes(keyPart)) {
      trace.search.push([`${keySearch}:`, 'not found'])
      delete trace.publishedState
      error(
        errorCode,
        `The key "${keyPart}" in "${key}" could not be found in the ` +
          errorSource
      )
    }
    search = search[keyPart]
    trace.search.push([`${keySearch}:`, search])
  }

  delete trace.search
  return search
}
