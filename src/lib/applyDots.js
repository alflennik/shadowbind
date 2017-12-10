import { trace } from '../globals.js' // eslint-disable-line
import error from './error.js'

export default function applyDots (
  baseData,
  key,
  baseName,
  errorSource,
  errorCode
) {
  traceSearch([`${baseName}:`, baseData])
  let search = baseData
  let keySearch = baseName

  for (const keyPart of key.split('.')) {
    keySearch = `${keySearch}.${keyPart}`
    if (!Object.keys(search).includes(keyPart)) {
      traceSearch([`${keySearch}:`, 'not found'])
      trace.remove('publishedState')

      error(
        errorCode,
        `The key "${keyPart}" in "${key}" could not be found in the ` +
          errorSource
      )
    }

    search = search[keyPart]
    traceSearch([`${keySearch}:`, search])
  }

  trace.remove('search')
  return search
}

function traceSearch (item) {
  if (!trace.get().search) trace.add('search', [])
  trace.add('search', [ ...trace.get().search, item ])
}
