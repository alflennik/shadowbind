// Convert attributes into data-binding instructions
export default function parseAttribute (attr) {
  const key = attr.value

  let matches = /^:(text|html|if|show|publish|tag)$/.exec(attr.name)
  if (matches) return { type: matches[1], subtype: null, key }

  matches = /^(bind|attr|prop|on|css|class):(.{1,})$/.exec(attr.name)
  if (matches) return { type: matches[1], subtype: matches[2], key }

  return null
}
