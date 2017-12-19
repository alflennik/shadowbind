// Convert attributes into data-binding instructions
export default function parseAttribute (attr) {
  const key = attr.value

  let matches = /^:(text|html|show|css|for)$/.exec(attr.name)
  if (matches) return { type: matches[1], param: null, key }

  matches = /^(bind|attr|prop|on):(.{1,})$/.exec(attr.name)
  if (matches) return { type: matches[1], param: matches[2], key }

  return null
}
