import getTrace from './trace.js'

export default function error (code, errorMessage, notes) {
  const trace = getTrace.get()

  const TRACE_START = '\n\n    '
  const TRACE_LINE = '\n    '

  let message = [errorMessage]

  if (trace.length) {
    message.push(TRACE_START)
    for (const traceItem of trace) {
      const traceIntro = getTraceIntro(traceItem[0])
      const traceData = traceItem[1]
      message.push(traceIntro, traceData, TRACE_LINE)
    }
  }

  if (notes) message.push('\n\n' + notes)

  console.error(...message)
  throw { code } // eslint-disable-line
}

function getTraceIntro (name) {
  switch (name) {
    case 'attributeState': return 'attribute state:'
    case 'repeaterState': return 'repeater state:'
    case 'bindReturned': return 'processed state:'
    case 'subscribedState': return 'component state:'
    case 'publishedState': return 'global state:'
    case 'attribute': return 'in attribute:'
    case 'element': return 'in element:'
    case 'component': return 'in component:'
  }
  return name
}
