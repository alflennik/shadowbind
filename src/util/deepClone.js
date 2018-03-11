export default function deepClone (obj) {
  return JSON.parse(JSON.stringify(obj)) // Yup, that's how I did it
}
