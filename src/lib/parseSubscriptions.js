import getType from '../util/getType.js'

export default function parseSubscriptions (subscriptionObject) {
  let stateSubscriptions = []
  let attributeSubscriptions = []

  for (const [key, value] of Object.entries(subscriptionObject)) {
    switch (getType(value)) {
      case 'string':
        if (value === 'state') stateSubscriptions.push([key, key])
        if (value === 'attr') attributeSubscriptions.push([key, key])
        break

      case 'object':
        if (value.state) stateSubscriptions.push([value.state, key])
        break
    }
  }

  return { stateSubscriptions, attributeSubscriptions }
}
