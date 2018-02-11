export default function parseSubscriptions (subscriptionObject) {
  let stateSubscriptions = []
  let attributeSubscriptions = []

  for (const [key, value] of Object.entries(subscriptionObject)) {
    if (value === 'state') stateSubscriptions.push(key)
    if (value === 'attr') attributeSubscriptions.push(key)
  }

  return { stateSubscriptions, attributeSubscriptions }
}
