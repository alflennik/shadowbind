import error from './lib/error.js'
import * as queue from './lib/queue.js'
import { getFormValues, setFormValues } from './util/formValues.js'
import parseSubscriptions from './lib/parseSubscriptions.js'
import deepCompare from './util/deepCompare.js'
import { state, oldState } from './publish.js'
import objectSearch from './util/objectSearch.js'

let componentId = 0

export default class Element extends window.HTMLElement {
  constructor () {
    super()
    this.sbPrivate = {}

    componentId++
    this.sbPrivate.id = componentId

    const {
      subscriptions,
      observedProps,
      observedState
    } = parseSubscriptions(this.subscribe ? this.subscribe() : {})

    this.sbPrivate.observedState = observedState
    this.sbPrivate.observedProps = observedProps
    this.sbPrivate.subscriptions = subscriptions
    this.sbPrivate.data = {}

    this.sbPrivate.getDepth = () => {
      if (
        !this.parentNode ||
        !this.parentNode.host ||
        !this.parentNode.host.sbPrivate
      ) {
        return 0
      }
      return this.parentNode.host.sbPrivate.getDepth() + 1
    }

    if (this.template) {
      this.attachShadow({ mode: 'open' })
      const template = document.createElement('template')
      const innerContent = this.template()
      template.innerHTML = innerContent === undefined ? '' : innerContent
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    this.sbPrivate.updateState = () => {
      let changedState = {}
      const observedState = this.sbPrivate.observedState
      for (const watchKey of observedState) {
        let oldValue = objectSearch(oldState, watchKey)
        let newValue = objectSearch(state, watchKey)
        if (!deepCompare(newValue, oldValue)) changedState[watchKey] = newValue
      }
      if (Object.keys(changedState).length) {
        queue.add(this, { state: changedState })
      }
    }

    this.sbPrivate.updateState()

    this.sbPrivate.afterConnectedCallback = () => {
      if (this.getAttribute(':map')) return // Initial bind triggered by parent
      this.data({}) // Initial bind and event listeners attachment
    }
  }
  data (bindings) {
    if (arguments.length === 0) return Object.assign({}, this.sbPrivate.data)
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
