export function titleToTrain (TitleCase) {
  return TitleCase.replace(
    /[A-Z]/g,
    (letter, offset) => {
      if (offset === 0) return letter.toLowerCase()
      return '-' + letter.toLowerCase()
    }
  )
}

export function trainToCamel (trainCase) {
  return trainCase.replace(
    /-[a-z]/g,
    letters => letters.charAt(1).toUpperCase()
  ).replace(/-/g, '')
}

export function camelToTrain (camelCase) {
  return titleToTrain(camelCase)
}
