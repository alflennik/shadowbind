function Trace () {
  let stackTrace = []
  return {
    get: name => {
      if (!name) return stackTrace
      const index = recentIndexOfName(stackTrace, name)
      if (!index) return
      return stackTrace[index][1]
    },
    add: (name, value) => {
      stackTrace.push([name, value])
    },
    removeAll: name => {
      stackTrace.filter(item => item[0] !== name)
    },
    reset: () => {
      stackTrace = []
    }
  }
}

function recentIndexOfName (stackTrace, name) {
  for (let i = stackTrace.length - 1; i > 0; i--) {
    if (stackTrace[i][0] === name) return i
  }
}

const trace = Trace()

export default trace
