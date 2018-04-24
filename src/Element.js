import error from './lib/error.js'
import * as queue from './lib/queue.js'
import { getFormValues, setFormValues } from './util/formValues.js'
import parseSubscriptions from './lib/parseSubscriptions.js'
import deepCompare from './util/deepCompare.js'
import { state, oldState } from './publish.js'
import getType from './util/getType.js'

export default class Element extends window.HTMLElement {
  constructor () {
    super()
    if (!this.sbPrivate) this.sbPrivate = {}

    const {
      subscriptions,
      observedProps,
      observedState
    } = parseSubscriptions(this.subscribe ? this.subscribe() : {})

    this.sbPrivate.observedState = observedState
    this.sbPrivate.observedProps = observedProps
    this.sbPrivate.subscriptions = subscriptions
    this.sbPrivate.data = {}

    if (this.template) {
      this.attachShadow({ mode: 'open' })
      const template = document.createElement('template')
      const innerContent = this.template()
      template.innerHTML = innerContent === undefined ? '' : innerContent
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    this.sbPrivate.getDepth = () => {
      if (
        !this.parentNode ||
        !this.parentNode.host ||
        !this.parentNode.host.sbPrivate ||
        !this.parentNode.host.sbPrivate.getDepth
      ) {
        return 0
      }
      return this.parentNode.host.sbPrivate.getDepth() + 1
    }

    this.sbPrivate.updateState = () => {
      let changedState = {}
      const observedState = this.sbPrivate.observedState
      for (const watchKey of observedState) {
        const oldValue = applyStateKeyDots(oldState, watchKey)
        const newValue = applyStateKeyDots(state, watchKey)

        if (!deepCompare(newValue, oldValue)) changedState[watchKey] = newValue
      }
      if (Object.keys(changedState).length) {
        queue.add(this, { state: changedState })
      }
    }

    this.sbPrivate.updateState()
  }
  data (bindings) {
    if (arguments.length === 0) return this.sbPrivate.data
    queue.add(this, { direct: bindings })
  }
  form (newValues) {
    const firstForm = this.shadowRoot.querySelector('form')
    if (!firstForm) {
      error(
        'shadowbind_missing_form',
        'Cannot use this.form() because there is no form in this component'
      )
    }
    if (arguments.length > 0) {
      return setFormValues(firstForm, newValues)
    } else {
      return getFormValues(firstForm)
    }
  }
}

export function applyStateKeyDots (state, watchKey) {
  if (getType(state) !== 'object') return

  if (!/^[^.].+[^.]$/.test(watchKey)) { // cannot begin or end with dot
    error(
      'shadowbind_subscribe_key_invalid',
      `The key "${watchKey}" could not be parsed`
    )
  }

  let search = state

  for (const keyPart of watchKey.split('.')) {
    if (search[keyPart] === undefined) return
    search = search[keyPart]
  }

  return search
}
