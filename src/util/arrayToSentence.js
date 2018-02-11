export default function arrayToSentence (arr) {
  if (arr.length === 0) return ''
  if (arr.length === 1) return arr[0]
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`
  if (arr.length >= 3) {
    return `${arr.slice(0, -1).join(', ')} and ${arr.slice(-1)}`
  }
}
