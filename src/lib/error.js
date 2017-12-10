import { trace as getTrace } from '../globals.js'

export default function error (code, errorMessage, notes) {
  const trace = getTrace.get()

  const TRACE_START = '\n\n    '
  const TRACE_LINE = '\n    '

  let message = [errorMessage]
  const traceOrder = [
    ...(trace.search ? trace.search : []),
    ['css property:', trace.cssProp],
    ['attribute state:', trace.attributeState],
    ['bind returned:', trace.bindReturned],
    ['subscribed state:', trace.subscribedState],
    ['published state:', trace.publishedState],
    ['affected attribute:', trace.attribute],
    ['affected element:', trace.element],
    ['affected web component:', trace.component]
  ]

  if (Object.keys(trace).length) {
    message.push(TRACE_START)
    for (const [traceIntro, traceData] of traceOrder) {
      if (traceData) message.push(traceIntro, traceData, TRACE_LINE)
    }
  }

  if (notes) message.push('\n\n' + notes)

  console.error(...message)
  throw new Error({ code })
}
