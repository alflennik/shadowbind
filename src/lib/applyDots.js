import { trace } from '../globals.js' // eslint-disable-line
import error from './error.js'

export default function applyDots (baseData, key, baseName, errorSource, errorCode) {
  trace.add('search', [[`${baseName}:`, baseData]])
  let search = baseData
  let keySearch = baseName

  for (const keyPart of key.split('.')) {
    keySearch = `${keySearch}.${keyPart}`
    if (!Object.keys(search).includes(keyPart)) {
      trace.search.add('search', trace.get().search.push([`${keySearch}:`, 'not found']))
      trace.remove('publishedState')
      error(
        errorCode,
        `The key "${keyPart}" in "${key}" could not be found in the ` +
          errorSource
      )
    }
    search = search[keyPart]
    trace.search.add('search', trace.get().search.push([`${keySearch}:`, search]))
  }

  trace.remove('search')
  return search
}
