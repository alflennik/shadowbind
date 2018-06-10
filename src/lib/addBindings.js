export function addBindings (component, changes = {}) {
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

  component.sbPrivate.bindings = Object.assign(
    component.sbPrivate.bindings || {},
    bindings
  )

  component.sbPrivate.direct = Object.assign(
    component.sbPrivate.direct || {},
    changes.direct || {}
  )
}

export function flattenBindings (component) {
  component.sbPrivate.data = Object.assign(
    component.sbPrivate.data || {},
    component.sbPrivate.bindings || {},
    component.sbPrivate.direct
  )
  component.sbPrivate.bindings = {}
  component.sbPrivate.direct = {}
}
