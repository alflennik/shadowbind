export default function getBindings ({ component, changes = {} }) {
  const { subscriptions, bindings: oldBindings = {} } = component.sbPrivate
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

  const newBindings = Object.assign(oldBindings, bindings, changes.direct)
  component.sbPrivate.bindings = newBindings
  return newBindings
}
