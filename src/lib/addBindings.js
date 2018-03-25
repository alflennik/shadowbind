export default function addBindings (component, changes = {}) {
  const subscriptions = component.sbPrivate.subscriptions
  let bindings = {}

  for (const [bindKey, watchers] of Object.entries(subscriptions)) {
    for (const { source, watchKey, callback } of watchers) {
      const sourceChanges = (() => {
        if (source === 'attr') return changes['attrs']
        if (source === 'prop') return changes['props']
        return changes[source]
      })() || {}

      const startValue = sourceChanges[watchKey]
      const value = startValue && callback ? callback(startValue) : startValue
      if (value !== undefined) {
        bindings[bindKey] = value
        break
      }
    }
  }

  const newPublished = Object.assign(
    component.sbPrivate.bindings || {},
    bindings
  )

  component.sbPrivate.direct = Object.assign(
    component.sbPrivate.direct || {},
    changes.direct
  )

  component.sbPrivate.bindings = newPublished
  return newPublished
}
