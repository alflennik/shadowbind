function Trace () {
  let stackTrace = {}
  return {
    get: () => stackTrace,
    add: (name, value) => {
      stackTrace[name] = value
    },
    set: (newTrace) => {
      stackTrace = newTrace
    },
    remove: (name) => {
      delete stackTrace[name]
    },
    reset: () => {
      stackTrace = {}
    }
  }
}

const trace = Trace()

export default trace
