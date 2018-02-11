import trace from './trace.js'
import error from './error.js'

export default function applyDots (
  baseData,
  key,
  baseName,
  errorSource,
  errorCode
) {
  trace.add(`${baseName}:`, baseData)
  let search = baseData
  let keySearch = baseName

  for (const keyPart of key.split('.')) {
    keySearch = `${keySearch}.${keyPart}`
    if (!Object.keys(search).includes(keyPart)) {
      trace.add(`${keySearch}:`, 'not found')

      error(
        errorCode,
        `The key "${keyPart}" in "${key}" could not be found in the ` +
          errorSource
      )
    }

    search = search[keyPart]
    trace.add(`${keySearch}:`, search)
  }

  trace.removeAll('search')
  return search
}
