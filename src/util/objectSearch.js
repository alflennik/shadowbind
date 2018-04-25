import getType from './getType.js'

export default function objectSearch (obj, key) {
  if (getType(obj) !== 'object') return

  if (!/^[^.].+[^.]$/.test(key)) return

  let search = obj

  for (const keyPart of key.split('.')) {
    if (search[keyPart] === undefined) return
    search = search[keyPart]
  }

  return search
}
