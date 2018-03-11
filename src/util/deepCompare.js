export default function deepCompare (val1, val2) {
  return JSON.stringify(val1) === JSON.stringify(val2)
}
