export default function toCamelCase (trainCase) {
  return trainCase.replace(/-([a-z])/g, letters => letters[1].toUpperCase())
}
