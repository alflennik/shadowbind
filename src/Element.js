import error from './lib/error.js'
import * as queue from './lib/queue.js'
import { getFormValues, setFormValues } from './util/formValues.js'
import parseSubscriptions from './lib/parseSubscriptions.js'

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
      template.innerHTML = this.template()
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

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
