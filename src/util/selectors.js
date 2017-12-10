export function el (selector, context = document) {
  selector = selector.replace(':', '\\:')
  return context.querySelector(selector)
}

export function elAll (selector, context = document) {
  selector = selector.replace(':', '\\:')
  return Array.prototype.slice.call(
    context.querySelectorAll(selector)
  )
}
