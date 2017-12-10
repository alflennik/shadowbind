export default function getType (item) {
  const jsType = typeof item
  if (jsType !== 'object') return typeof item
  if (item === null) return 'null'
  if (Array.isArray(item)) return 'array'
  return 'object'
}
