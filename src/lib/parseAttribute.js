// Convert attributes into data-binding instructions
export default function parseAttribute (attr) {
  const key = attr.value

  let matches = /^:(text|html|if|show|tag|value)$/.exec(attr.name)
  if (matches) return { type: matches[1], subtype: null, key }

  matches = /^(attr|prop|on|css|class):(.{1,})$/.exec(attr.name)
  if (matches) return { type: matches[1], subtype: matches[2], key }

  return null
}

export const priorityAttributes = ['value']
