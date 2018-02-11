export default function pascalToTrainCase (PascalCase) {
  return PascalCase.replace(
    /[A-Z]/g,
    (letter, offset) => {
      if (offset === 0) return letter.toLowerCase()
      return '-' + letter.toLowerCase()
    }
  )
}
