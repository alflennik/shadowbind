(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["shadowbind"] = factory();
	else
		root["shadowbind"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (trace);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = error;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__trace_js__ = __webpack_require__(0);


function error (code, errorMessage, notes) {
  const trace = __WEBPACK_IMPORTED_MODULE_0__trace_js__["a" /* default */].get()

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
  class ShadowbindError extends Error {}
  const error = new ShadowbindError(code)
  error.code = code
  throw error
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getType;
function getType (item) {
  const jsType = typeof item
  if (jsType !== 'object') return typeof item
  if (item === null) return 'null'
  if (Array.isArray(item)) return 'array'
  return 'object'
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = start;
/* harmony export (immutable) */ __webpack_exports__["c"] = stop;
/* harmony export (immutable) */ __webpack_exports__["a"] = add;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__addBindings_js__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__bindComponent_js__ = __webpack_require__(16);



let queue = []
let stopCount = 0

function start () {
  if (stopCount > 0) stopCount--
  processQueue()
}

function stop () {
  stopCount++
}

function add (component, changes = {}) {
  let { id } = component.sbPrivate
  const depth = component.sbPrivate.getDepth()
  if (!queue[depth]) queue[depth] = {}
  if (!queue[depth][id]) queue[depth][id] = {}
  if (!queue[depth][id].changes) queue[depth][id].changes = {}

  Object.assign(queue[depth][id].changes, changes)
  Object(__WEBPACK_IMPORTED_MODULE_0__addBindings_js__["a" /* default */])(component, changes)
  queue[depth][id].component = component

  processQueue()
}

function processQueue () {
  if (stopCount !== 0) return

  let queueItem = nextQueueItem()
  while (queueItem) {
    queueItem.component.sbPrivate.data = Object.assign(
      queueItem.component.sbPrivate.bindings,
      queueItem.component.sbPrivate.direct
    )
    Object(__WEBPACK_IMPORTED_MODULE_1__bindComponent_js__["a" /* default */])(queueItem.component, queueItem.component.sbPrivate.data)
    queueItem = nextQueueItem()
  }
}

function nextQueueItem () {
  const currentDepth = (() => {
    for (let i = 0; i < queue.length; i++) {
      if (!queue[i]) continue
      return i
    }
    if (queue.length > 0) queue = [] // Queue was filled with undefined
    return false
  })()

  if (currentDepth === false) return

  for (const id in queue[currentDepth]) {
    const queueItem = queue[currentDepth][id]
    delete queue[currentDepth][id]
    if (Object.keys(queue[currentDepth]).length === 0) {
      queue[currentDepth] = undefined
    }
    return queueItem
  }
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return state; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return oldState; });
/* harmony export (immutable) */ __webpack_exports__["a"] = publish;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_trace_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_deepClone_js__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_connectedComponents_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_queue_js__ = __webpack_require__(3);





let state
let oldState

// Apply data-binding to all affected web components when the state changes
function publish (newState) {
  __WEBPACK_IMPORTED_MODULE_0__lib_trace_js__["a" /* default */].reset()
  __WEBPACK_IMPORTED_MODULE_0__lib_trace_js__["a" /* default */].add('publishedState', newState)
  __WEBPACK_IMPORTED_MODULE_3__lib_queue_js__["c" /* stop */]()

  oldState = state
  state = Object(__WEBPACK_IMPORTED_MODULE_1__util_deepClone_js__["a" /* default */])(newState)

  for (const component of __WEBPACK_IMPORTED_MODULE_2__lib_connectedComponents_js__["b" /* getAll */]()) {
    component.sbPrivate.updateState()
  }

  __WEBPACK_IMPORTED_MODULE_3__lib_queue_js__["b" /* start */]()
  __WEBPACK_IMPORTED_MODULE_0__lib_trace_js__["a" /* default */].remove('publishedState')
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = assertType;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_getType_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_arrayToSentence_js__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__error_js__ = __webpack_require__(1);




function assertType (value, types, name) {
  if (!Array.isArray(types)) types = [types]
  const actual = Object(__WEBPACK_IMPORTED_MODULE_0__util_getType_js__["a" /* default */])(value)

  if (types.includes(actual)) return

  const errorMessage = (() => {
    if (value === undefined) return `The ${name} cannot be undefined`
    return `The ${name} was "${actual}" but expected type ` +
      `${Object(__WEBPACK_IMPORTED_MODULE_1__util_arrayToSentence_js__["a" /* default */])(types.map(type => `"${type}"`))}`
  })()

  const errorCode = `shadowbind_${name.replace(/[^a-z]/g, '_')}`

  Object(__WEBPACK_IMPORTED_MODULE_2__error_js__["a" /* default */])(errorCode, errorMessage)
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export components */
/* harmony export (immutable) */ __webpack_exports__["a"] = add;
/* harmony export (immutable) */ __webpack_exports__["c"] = remove;
/* harmony export (immutable) */ __webpack_exports__["b"] = getAll;
let components = {}

function add (id, component) {
  components[id] = component
}

function remove (id) {
  delete components[id]
}

function getAll () {
  return Object.values(components)
}


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = walkElement;
// Run callback on every attribute of a dom element
function walkElement (element, callback) {
  for (const attribute of element.attributes) {
    if (!attribute.name) return
    callback(attribute)
  }
}


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = parseAttribute;
// Convert attributes into data-binding instructions
function parseAttribute (attr) {
  const key = attr.value

  let matches = /^:(text|html|if|show|tag|value)$/.exec(attr.name)
  if (matches) return { type: matches[1], subtype: null, key }

  matches = /^(attr|prop|on|css|class):(.{1,})$/.exec(attr.name)
  if (matches) return { type: matches[1], subtype: matches[2], key }

  return null
}

const priorityAttributes = ['value']
/* harmony export (immutable) */ __webpack_exports__["b"] = priorityAttributes;



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bindAttribute;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__trace_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__error_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__assertType_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util_objectSearch_js__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_getType_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_toCamelCase_js__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__util_walkElement_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__bindIf_js__ = __webpack_require__(22);









function bindAttribute (
  component,
  element,
  bindings,
  type,
  subtype,
  key
) {
  if (type === 'on') {
    return bindEvent(component, element, bindings, subtype, key)
  }

  let value = key.indexOf('.') === -1
    ? bindings[key]
    : Object(__WEBPACK_IMPORTED_MODULE_3__util_objectSearch_js__["a" /* default */])(bindings, key)

  if (value == null) return

  __WEBPACK_IMPORTED_MODULE_0__trace_js__["a" /* default */].add('attributeState', value)
  const valueType = Object(__WEBPACK_IMPORTED_MODULE_4__util_getType_js__["a" /* default */])(value)

  if (
    (valueType === 'object' || valueType === 'array') &&
    (type === 'attr' || type === 'text' || type === 'html')
  ) {
    const bindSubnote = type === 'attr'
      ? ` or use prop:${subtype} to bind the data as a property instead of ` +
        'an attribute'
      : ''
    Object(__WEBPACK_IMPORTED_MODULE_1__error_js__["a" /* default */])(
      'shadowbind_binding_array_or_object',
      `Objects and arrays cannot be bound with "${type}" directly. Try ` +
        `calling JSON.stringify on the ${valueType} first${bindSubnote}.`
    )
  }

  switch (type) {
    case 'attr':
      if (value === true) {
        element.setAttribute(subtype, '')
      } else if (value != null && value !== false) {
        element.setAttribute(subtype, value)
      } else {
        element.removeAttribute(subtype)
      }
      break

    case 'prop':
      const camelCaseSubtype = Object(__WEBPACK_IMPORTED_MODULE_5__util_toCamelCase_js__["a" /* default */])(subtype)
      const methodType = Object(__WEBPACK_IMPORTED_MODULE_4__util_getType_js__["a" /* default */])(element[camelCaseSubtype])

      if (methodType !== 'function') {
        if (methodType === 'undefined') {
          Object(__WEBPACK_IMPORTED_MODULE_1__error_js__["a" /* default */])(
            'shadowbind_prop_undefined',
            `Cannot call prop "${camelCaseSubtype}" because it is undefined`
          )
        }
        Object(__WEBPACK_IMPORTED_MODULE_1__error_js__["a" /* default */])(
          'shadowbind_prop_type',
          `Prop "${camelCaseSubtype}" must be a function, but it is type ` +
            `${methodType}`
        )
      }

      element[camelCaseSubtype](value)
      break

    case 'text':
    case 'html':
      Object(__WEBPACK_IMPORTED_MODULE_2__assertType_js__["a" /* default */])(value, ['string', 'number'], `inner ${type} type`)
      type === 'text' ? element.innerText = value : element.innerHTML = value
      break

    case 'show':
      if (!value) element.style.display = 'none'
      else element.style.display = ''
      break

    case 'if':
      const placeholderId = element.getAttribute('sb:i')
      if (value) {
        if (!placeholderId) return
        Object(__WEBPACK_IMPORTED_MODULE_7__bindIf_js__["a" /* putElementBack */])(element)
      } else {
        if (placeholderId) return
        Object(__WEBPACK_IMPORTED_MODULE_7__bindIf_js__["b" /* replaceWithPlaceholder */])(element)
      }
      break

    case 'css':
      if (value != null) {
        element.style.setProperty(`--${subtype}`, value)
      } else {
        element.style.removeProperty(`--${subtype}`)
      }
      break

    case 'class':
      if (value) {
        element.classList.add(subtype)
      } else {
        element.classList.remove(subtype)
      }
      break

    case 'tag':
      const validTagName = (() => {
        if (valueType !== 'string') return false
        value = value.toLowerCase()
        return /^[a-z][a-z0-9_-]+$/.test(value)
      })()

      if (!validTagName) {
        Object(__WEBPACK_IMPORTED_MODULE_1__error_js__["a" /* default */])(
          'shadowbind_tag_name',
          `The value given for :tag must be a valid element name`
        )
      }

      if (element.tagName.toLowerCase() === value.toLowerCase()) return
      const replacement = document.createElement(value)
      replacement.innerHTML = element.innerHTML
      Object(__WEBPACK_IMPORTED_MODULE_6__util_walkElement_js__["a" /* default */])(element, attribute => {
        replacement.setAttribute(attribute.name, attribute.value)
      })

      const parent = element.parentNode
      const sibling = element.nextElementSibling
      parent.removeChild(element)
      parent.insertBefore(replacement, sibling)
      break

    case 'value':
      if (element.options && element.multiple) {
        for (const option of element.options) {
          if (value.includes(option.value)) option.selected = true
        }
      } else if (element.type === 'checkbox') {
        if (value === true) element.checked = true
        else if (value === false) element.checked = false
        else {
          if (value.includes(element.value)) element.checked = true
        }
      } else if (element.type === 'radio') {
        if (value === element.value) element.checked = true
      } else {
        element.value = value
      }
      break
  }

  __WEBPACK_IMPORTED_MODULE_0__trace_js__["a" /* default */].remove('attributeState')
}

function bindEvent (component, element, bindings, subtype, key) {
  if (component[key] === undefined) {
    Object(__WEBPACK_IMPORTED_MODULE_1__error_js__["a" /* default */])(
      'shadowbind_undefined_event_method',
      `Expected to find method "${key}" on your component to use as an event ` +
        `handler`
    )
  }
  Object(__WEBPACK_IMPORTED_MODULE_2__assertType_js__["a" /* default */])(component[key], 'function', 'event type')

  if (
    !(element.sbPrivate && element.sbPrivate.eventsAlreadyBound)
  ) {
    subtype.split(',').forEach(trigger => {
      element.addEventListener(trigger, event => {
        const shouldPropagate = component[key](event)
        if (shouldPropagate !== false) return
        event.preventDefault()
        event.stopPropagation()
      })
      if (!element.sbPrivate) element.sbPrivate = {}
      element.sbPrivate.eventsAlreadyBound = true
    })
  }
}


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = objectSearch;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__getType_js__ = __webpack_require__(2);


function objectSearch (obj, key) {
  if (Object(__WEBPACK_IMPORTED_MODULE_0__getType_js__["a" /* default */])(obj) !== 'object') return

  if (!/^[^.].+[^.]$/.test(key)) return

  let search = obj

  for (const keyPart of key.split('.')) {
    if (search[keyPart] === undefined) return
    search = search[keyPart]
  }

  return search
}


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = parseSubscriptions;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_getType_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__error_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__assertType_js__ = __webpack_require__(5);




let subscriptions
let observedAttrs
let observedProps
let observedState

function parseSubscriptions (subscriptionObject) {
  subscriptions = {}
  observedAttrs = []
  observedProps = []
  observedState = []

  for (const [bindKey, value] of Object.entries(subscriptionObject)) {
    subscriptions[bindKey] = []

    switch (Object(__WEBPACK_IMPORTED_MODULE_0__util_getType_js__["a" /* default */])(value)) {
      case 'string':
        addBindingFromString(bindKey, value)
        continue

      case 'object':
        addBindingFromObject(bindKey, value)
        continue

      case 'array':
        for (const binder of value) {
          const valueType = Object(__WEBPACK_IMPORTED_MODULE_0__util_getType_js__["a" /* default */])(binder)
          if (valueType === 'string') addBindingFromString(bindKey, binder)
          if (valueType === 'object') addBindingFromObject(bindKey, binder)
        }
        continue
    }

    failureToParse()
  }

  return { subscriptions, observedAttrs, observedProps, observedState }
}

function addBinding ({ bindKey, source, watchKey, callback }) {
  if (watchKey) {
    if (source === 'state') observedState.push(watchKey)
    else if (source === 'attr') observedAttrs.push(watchKey)
    else if (source === 'prop') observedProps.push(watchKey)
    else failureToParse()
  }
  Object(__WEBPACK_IMPORTED_MODULE_2__assertType_js__["a" /* default */])(callback, ['function', 'undefined'], 'subscribe callback')
  Object(__WEBPACK_IMPORTED_MODULE_2__assertType_js__["a" /* default */])(watchKey, ['string'], 'subscribe watch key')
  subscriptions[bindKey].push({ source, watchKey, callback })
}

function addBindingFromObject (bindKey, obj) {
  const source = (() => {
    if (obj.state) return 'state'
    if (obj.prop) return 'prop'
    if (obj.attr) return 'attr'
  })()

  if (!/^[^.].+[^.]$/.test(obj[source])) failureToParse()

  addBinding({ bindKey, source, watchKey: obj[source], callback: obj.callback })
}

function addBindingFromString (bindKey, str) {
  addBinding({ bindKey, source: str, watchKey: bindKey, callback: undefined })
}

function failureToParse () {
  Object(__WEBPACK_IMPORTED_MODULE_1__error_js__["a" /* default */])(
    'shadowbind_invalid_subscribe',
    'Your subscribe() response is invalid'
  )
}


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_error_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_queue_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_formValues_js__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_parseSubscriptions_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_deepCompare_js__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__publish_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__util_objectSearch_js__ = __webpack_require__(10);








let componentId = 0

class Element extends window.HTMLElement {
  constructor () {
    super()
    this.sbPrivate = {}

    componentId++
    this.sbPrivate.id = componentId

    const {
      subscriptions,
      observedProps,
      observedState
    } = Object(__WEBPACK_IMPORTED_MODULE_3__lib_parseSubscriptions_js__["a" /* default */])(this.subscribe ? this.subscribe() : {})

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
        let oldValue = Object(__WEBPACK_IMPORTED_MODULE_6__util_objectSearch_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_5__publish_js__["b" /* oldState */], watchKey)
        let newValue = Object(__WEBPACK_IMPORTED_MODULE_6__util_objectSearch_js__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_5__publish_js__["c" /* state */], watchKey)
        if (!Object(__WEBPACK_IMPORTED_MODULE_4__util_deepCompare_js__["a" /* default */])(newValue, oldValue)) changedState[watchKey] = newValue
      }
      if (Object.keys(changedState).length) {
        __WEBPACK_IMPORTED_MODULE_1__lib_queue_js__["a" /* add */](this, { state: changedState })
      }
    }

    this.sbPrivate.updateState()

    this.sbPrivate.afterConnectedCallback = () => {
      if (this.getAttribute(':map')) return // Initial bind triggered by parent
      this.data({}) // Initial bind and event listeners attachment
    }
  }
  data (bindings) {
    if (arguments.length === 0) return this.sbPrivate.data
    __WEBPACK_IMPORTED_MODULE_1__lib_queue_js__["a" /* add */](this, { direct: bindings })
  }
  form (newValues) {
    const firstForm = this.shadowRoot.querySelector('form')
    if (!firstForm) {
      Object(__WEBPACK_IMPORTED_MODULE_0__lib_error_js__["a" /* default */])(
        'shadowbind_missing_form',
        'Cannot use this.form() because there is no form in this component'
      )
    }
    if (arguments.length > 0) {
      return Object(__WEBPACK_IMPORTED_MODULE_2__util_formValues_js__["b" /* setFormValues */])(firstForm, newValues)
    } else {
      return Object(__WEBPACK_IMPORTED_MODULE_2__util_formValues_js__["a" /* getFormValues */])(firstForm)
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Element;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__publish_js__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__define_js__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__redux_js__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Element_js__ = __webpack_require__(12);





/* harmony default export */ __webpack_exports__["default"] = ({ define: __WEBPACK_IMPORTED_MODULE_1__define_js__["a" /* default */], publish: __WEBPACK_IMPORTED_MODULE_0__publish_js__["a" /* default */], redux: __WEBPACK_IMPORTED_MODULE_2__redux_js__["a" /* default */], Element: __WEBPACK_IMPORTED_MODULE_3__Element_js__["a" /* default */] });
window.Shadowbind = { define: __WEBPACK_IMPORTED_MODULE_1__define_js__["a" /* default */], publish: __WEBPACK_IMPORTED_MODULE_0__publish_js__["a" /* default */], redux: __WEBPACK_IMPORTED_MODULE_2__redux_js__["a" /* default */], Element: __WEBPACK_IMPORTED_MODULE_3__Element_js__["a" /* default */] }


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = deepClone;
function deepClone (obj) {
  return JSON.parse(JSON.stringify(obj)) // Yup, that's how I did it
}


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = addBindings;
function addBindings (component, changes = {}) {
  const subscriptions = component.sbPrivate.subscriptions
  let bindings = {}

  for (const [bindKey, watchers] of Object.entries(subscriptions)) {
    for (const { source, watchKey, callback } of watchers) {
      const sourceChanges = (() => {
        if (source === 'attr') return changes['attrs']
        if (source === 'prop') return changes['props']
        return changes[source]
      })() || {}

      const startValue = sourceChanges[watchKey]
      const value = startValue && callback ? callback(startValue) : startValue
      if (value !== undefined) {
        bindings[bindKey] = value
        break
      }
    }
  }

  const newPublished = Object.assign(
    component.sbPrivate.bindings || {},
    bindings
  )

  component.sbPrivate.direct = Object.assign(
    component.sbPrivate.direct || {},
    changes.direct
  )

  component.sbPrivate.bindings = newPublished
  return newPublished
}


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bindComponent;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bindRepeater_js__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_walkFragment_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__assertType_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bindElement_js__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__trace_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__parseAttribute_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__bindAttribute_js__ = __webpack_require__(9);








function bindComponent (component, bindings) {
  __WEBPACK_IMPORTED_MODULE_4__trace_js__["a" /* default */].add('component', component)
  __WEBPACK_IMPORTED_MODULE_4__trace_js__["a" /* default */].add('subscribedState', bindings)

  if (component.beforeBindCallback) component.beforeBindCallback()

  if (component.bindings) {
    Object(__WEBPACK_IMPORTED_MODULE_2__assertType_js__["a" /* default */])(component.bindings, 'function', 'bindings property type')

    bindings = component.bindings(bindings)
    __WEBPACK_IMPORTED_MODULE_4__trace_js__["a" /* default */].add('bindReturned', bindings)

    Object(__WEBPACK_IMPORTED_MODULE_2__assertType_js__["a" /* default */])(bindings, 'object', 'bindings method return type')
  }

  Object(__WEBPACK_IMPORTED_MODULE_1__util_walkFragment_js__["a" /* default */])(component, element => {
    __WEBPACK_IMPORTED_MODULE_4__trace_js__["a" /* default */].add('element', element)
    // Bind the tag first so events can be reattached after element is recreated
    // and repeaters can run
    const tagAttribute = element.attributes[':tag']
    if (tagAttribute) {
      __WEBPACK_IMPORTED_MODULE_4__trace_js__["a" /* default */].add('attribute', tagAttribute)
      bindTag(component, element, bindings)
      __WEBPACK_IMPORTED_MODULE_4__trace_js__["a" /* default */].remove('attribute')
      // If element has been removed, continue to next element, its replacement
      if (element.parentNode === null) return
    }

    Object(__WEBPACK_IMPORTED_MODULE_0__bindRepeater_js__["a" /* default */])(element, bindings)
    if (!element.attributes[':map']) {
      Object(__WEBPACK_IMPORTED_MODULE_3__bindElement_js__["a" /* default */])(component, element, bindings)
    }
    __WEBPACK_IMPORTED_MODULE_4__trace_js__["a" /* default */].remove('element')
  })

  if (component.afterBindCallback) component.afterBindCallback()

  __WEBPACK_IMPORTED_MODULE_4__trace_js__["a" /* default */].remove('bindReturned')
  __WEBPACK_IMPORTED_MODULE_4__trace_js__["a" /* default */].remove('subscribedState')
  __WEBPACK_IMPORTED_MODULE_4__trace_js__["a" /* default */].remove('component')
}

function bindTag (component, element, bindings) {
  const { type, subtype, key } = Object(__WEBPACK_IMPORTED_MODULE_5__parseAttribute_js__["a" /* default */])(element.attributes[':tag'])
  Object(__WEBPACK_IMPORTED_MODULE_6__bindAttribute_js__["a" /* default */])(component, element, bindings, type, subtype, key)
}


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bindRepeater;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_getType_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__trace_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__error_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__queue_js__ = __webpack_require__(3);





let emptyExamples = {}
let placeholderId = 0

function bindRepeater (element, bindings) {
  const emptyRepeaterId = getEmptyRepeaterId(element)
  if (!firstElementInRepeat(element) && !emptyRepeaterId) return

  let { key, value } = loadKeyValue(element, emptyRepeaterId, bindings)

  if (value == null) return
  if (Object(__WEBPACK_IMPORTED_MODULE_0__util_getType_js__["a" /* default */])(value) !== 'array') {
    Object(__WEBPACK_IMPORTED_MODULE_2__error_js__["a" /* default */])(
      'shadowbind_map_type',
      `"${key}" must be an array when using ":map", but it was ` +
        `"${Object(__WEBPACK_IMPORTED_MODULE_0__util_getType_js__["a" /* default */])(value)}"`
    )
  }

  __WEBPACK_IMPORTED_MODULE_1__trace_js__["a" /* default */].add('repeaterState', value)

  const elements = emptyRepeaterId ? [] : currentRepeaterElements(element)
  const currentCount = elements.length
  const expectedCount = value.length

  if (currentCount < expectedCount) {
    const count = expectedCount - currentCount
    element = createElements(element, elements, emptyRepeaterId, count)
  } else if (currentCount > expectedCount) {
    removeElements(elements, element.parentNode, currentCount - expectedCount)
  }

  if (expectedCount === 0) return

  if (!element.sbPrivate) {
    Object(__WEBPACK_IMPORTED_MODULE_2__error_js__["a" /* default */])(
      'shadowbind_map_non_component',
      `":map" must be used on a shadowbind web component`
    )
  }

  for (let i = 0; i < expectedCount; i++) {
    __WEBPACK_IMPORTED_MODULE_3__queue_js__["a" /* add */](element, { direct: value[i] })
    element = element.nextElementSibling
  }

  __WEBPACK_IMPORTED_MODULE_1__trace_js__["a" /* default */].remove('repeaterState')
}

function firstElementInRepeat (element) {
  if (!element.getAttribute(':map')) return false
  const partOfRepeat = PartOfRepeat(element)
  if (element.previousElementSibling === null) return true
  return !partOfRepeat(element.previousElementSibling)
}

function PartOfRepeat (element) {
  const elementKey = element.getAttribute(':map')
  return compare => {
    if (compare === null) return false
    const key = compare.getAttribute(':map')
    return elementKey === key
  }
}

function loadKeyValue (element, emptyRepeaterId, bindings) {
  const key = (() => {
    if (!emptyRepeaterId) return element.getAttribute(':map')
    return emptyExamples[emptyRepeaterId].getAttribute(':map')
  })()
  const value = bindings[key]
  return { key, value }
}

function currentRepeaterElements (element) {
  const partOfRepeat = PartOfRepeat(element)
  let elements = []
  do {
    elements.push(element)
    element = element.nextElementSibling
  } while (partOfRepeat(element))

  return elements
}

function getEmptyRepeaterId (element) {
  return element.getAttribute('sb:r')
}

function createElements (element, elements, emptyRepeaterId, count) {
  const example = (() => {
    if (emptyRepeaterId) return emptyExamples[emptyRepeaterId]
    return element
  })()

  const prependElement = (() => {
    if (emptyRepeaterId) return element.nextElementSibling
    return elements[elements.length - 1].nextElementSibling
  })()

  const previousElement = element.previousElementSibling
  const parent = element.parentNode

  for (let i = 0; i < count; i++) {
    const newElement = example.cloneNode(true)
    parent.insertBefore(newElement, prependElement)
  }

  if (emptyRepeaterId) {
    parent.removeChild(element)
    if (!previousElement) return parent.firstElementChild
    return previousElement.nextElementSibling
  }
  return element
}

function removeElements (elements, parent, count) {
  if (elements.length === count) {
    const placeholder = generatePlaceholder()
    emptyExamples[placeholderId] = elements[0].cloneNode(true)
    const prependElement = elements[elements.length - 1].nextElementSibling
    parent.insertBefore(placeholder, prependElement)
  }
  const toRemove = elements.slice(-count)
  toRemove.forEach(element => parent.removeChild(element))
}

function generatePlaceholder () {
  placeholderId++
  const placeholder = document.createElement('span')
  placeholder.setAttribute('sb:r', placeholderId)
  return placeholder
}


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = walkFragment;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_trace_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__lib_error_js__ = __webpack_require__(1);



// Run callback on every element in the shadowDom, applying repeaters as needed
function walkFragment (component, callback) {
  let previousNode

  function recursiveWalk (node) {
    const wasAttachedToDom = node.parentNode
    const nodeIsAnElement = node.nodeType === 1
    if (nodeIsAnElement) callback(node)
    const stillAttachedAfterCallback = node.parentNode

    if (wasAttachedToDom && !stillAttachedAfterCallback) {
      // Some elements get removed by the callback, which would mess up the walk
      return true
    }

    previousNode = node
    node = node.firstChild

    while (node) {
      const wasJustRemovedFromDom = recursiveWalk(node)

      if (wasJustRemovedFromDom) {
        node = previousNode
      } else {
        previousNode = node
        node = node.nextSibling
      }
    }
  }

  if (!component.shadowRoot) shadowRootError(component)
  recursiveWalk(component.shadowRoot)
}

function shadowRootError (component) {
  try {
    component.attachShadow({ mode: 'open' })
  } catch (err) {
    Object(__WEBPACK_IMPORTED_MODULE_1__lib_error_js__["a" /* default */])(
      'shadowbind_closed_shadow_root',
      'Subscribed component has a closed shadowRoot, but only open ' +
        'shadowRoots are supported'
    )
  }
  Object(__WEBPACK_IMPORTED_MODULE_1__lib_error_js__["a" /* default */])(
    'shadowbind_no_shadow_root',
    'Subscribed web component has no shadowRoot. Be sure to define ' +
      "template() { return 'YOUR HTML' } in your component class"
  )
}


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = arrayToSentence;
function arrayToSentence (arr) {
  if (arr.length === 0) return ''
  if (arr.length === 1) return arr[0]
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`
  if (arr.length >= 3) {
    return `${arr.slice(0, -1).join(', ')} and ${arr.slice(-1)}`
  }
}


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bindElement;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_walkElement_js__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__parseAttribute_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bindAttribute_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__trace_js__ = __webpack_require__(0);





function bindElement (component, element, bindings) {
  if (element.attributes.length === 0) return

  for (const priorityAttribute of __WEBPACK_IMPORTED_MODULE_1__parseAttribute_js__["b" /* priorityAttributes */]) {
    if (element.attributes[priorityAttribute]) {
      const attribute = element.attributes[priorityAttribute]
      tryApplyAttribute(component, element, bindings, attribute)
    }
  }

  Object(__WEBPACK_IMPORTED_MODULE_0__util_walkElement_js__["a" /* default */])(element, attribute => {
    if (__WEBPACK_IMPORTED_MODULE_1__parseAttribute_js__["b" /* priorityAttributes */].includes(attribute)) return
    tryApplyAttribute(component, element, bindings, attribute)
  })
}

function tryApplyAttribute(component, element, bindings, attribute) {
  const parsedAttribute = Object(__WEBPACK_IMPORTED_MODULE_1__parseAttribute_js__["a" /* default */])(attribute)
  if (parsedAttribute) {
    __WEBPACK_IMPORTED_MODULE_3__trace_js__["a" /* default */].add('attribute', attribute)
    const { type, subtype, key } = parsedAttribute
    Object(__WEBPACK_IMPORTED_MODULE_2__bindAttribute_js__["a" /* default */])(component, element, bindings, type, subtype, key)
    __WEBPACK_IMPORTED_MODULE_3__trace_js__["a" /* default */].remove('attribute')
  }
}


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = toCamelCase;
function toCamelCase (trainCase) {
  return trainCase.replace(/-([a-z])/g, letters => letters[1].toUpperCase())
}


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = replaceWithPlaceholder;
/* harmony export (immutable) */ __webpack_exports__["a"] = putElementBack;
let removedByIf = {}
let removedCount = 0

function replaceWithPlaceholder (element) {
  const placeholder = createPlaceholder(element)
  const sibling = element.nextElementSibling
  const parent = element.parentNode
  removedByIf[removedCount] = element
  parent.removeChild(element)
  parent.insertBefore(placeholder, sibling)
}

function putElementBack (placeholder) {
  const placeholderId = placeholder.getAttribute('sb:i')
  const element = removedByIf[placeholderId]
  const sibling = placeholder.nextElementSibling
  const parent = placeholder.parentNode
  parent.removeChild(placeholder)
  parent.insertBefore(element, sibling)
}

function createPlaceholder (element) {
  removedCount++
  const placeholder = document.createElement('span')
  placeholder.setAttribute('sb:i', removedCount)
  placeholder.setAttribute(':if', element.getAttribute(':if'))
  return placeholder
}


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = define;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__lib_trace_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_getType_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_error_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_queue_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__lib_connectedComponents_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util_convertCase_js__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__lib_parseSubscriptions_js__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Element_js__ = __webpack_require__(12);









function define (Components) {
  __WEBPACK_IMPORTED_MODULE_0__lib_trace_js__["a" /* default */].reset()
  if (!arguments.length) {
    Object(__WEBPACK_IMPORTED_MODULE_2__lib_error_js__["a" /* default */])(
      'shadowbind_define_without_arguments',
      'The first argument of define() should an object but no arguments were ' +
        'given'
    )
  }

  __WEBPACK_IMPORTED_MODULE_3__lib_queue_js__["c" /* stop */]()
  for (const [name, Component] of Object.entries(Components)) {
    defineComponent(name, Component)
  }
  __WEBPACK_IMPORTED_MODULE_3__lib_queue_js__["b" /* start */]()
}

function defineComponent (name, Component) {
  if (!(Component.prototype instanceof __WEBPACK_IMPORTED_MODULE_7__Element_js__["a" /* default */])) {
    Object(__WEBPACK_IMPORTED_MODULE_2__lib_error_js__["a" /* default */])(
      'shadowbind_define_type',
      'The first argument of define() should be an object where the keys are ' +
        'component names and the values are classes extending ' +
        `Shadowbind.Element`
    )
  }

  if (/^[A-Z]/.test(name)) name = Object(__WEBPACK_IMPORTED_MODULE_5__util_convertCase_js__["b" /* titleToTrain */])(name)
  validateName(Component, name, arguments.length === 1)

  const rawSubscriptions = Component.prototype.subscribe
    ? Component.prototype.subscribe()
    : {}

  const { observedAttrs } = Object(__WEBPACK_IMPORTED_MODULE_6__lib_parseSubscriptions_js__["a" /* default */])(rawSubscriptions)

  class ShadowComponent extends Component {
    static get observedAttributes () {
      let manualAttrs = (() => {
        if (Object(__WEBPACK_IMPORTED_MODULE_1__util_getType_js__["a" /* default */])(Component.observedAttributes) === 'function') {
          return Component.observedAttributes()
        }
        return []
      })()
      return observedAttrs.concat(manualAttrs).map(attr => Object(__WEBPACK_IMPORTED_MODULE_5__util_convertCase_js__["a" /* camelToTrain */])(attr))
    }
    constructor () {
      super()
      if (this.sbPrivate.observedProps.length) {
        for (const prop of this.sbPrivate.observedProps) {
          this[prop] = value => {
            __WEBPACK_IMPORTED_MODULE_3__lib_queue_js__["a" /* add */](this, { props: { [prop]: value } })
          }
        }
      }
    }
    connectedCallback () {
      __WEBPACK_IMPORTED_MODULE_4__lib_connectedComponents_js__["a" /* add */](this.sbPrivate.id, this)
      forwardProperty(this, Component, 'connectedCallback')
      this.sbPrivate.afterConnectedCallback()
    }
    disconnectedCallback () {
      __WEBPACK_IMPORTED_MODULE_4__lib_connectedComponents_js__["c" /* remove */](this.sbPrivate.id)
      forwardProperty(this, Component, 'disconnectedCallback')
    }
    attributeChangedCallback (attrName, oldValue, newValue) {
      __WEBPACK_IMPORTED_MODULE_3__lib_queue_js__["a" /* add */](this, { attrs: { [Object(__WEBPACK_IMPORTED_MODULE_5__util_convertCase_js__["c" /* trainToCamel */])(attrName)]: newValue } })
      forwardProperty(this, Component, 'attributeChangedCallback', arguments)
    }
  }

  window.customElements.define(name, ShadowComponent)
}

function forwardProperty (component, Component, propertyName, args = []) {
  if (Component.prototype[propertyName]) {
    Component.prototype[propertyName].call(component, ...args)
  }
}

function validateName (Component, name, isImplicit) {
  if (!(
    name.indexOf('--') !== -1 ||
    name.indexOf('-') === -1 ||
    /^-/.test(name) !== false ||
    /-$/.test(name) !== false ||
    /[^a-zA-Z0-9-]/.test(name) !== false
  )) return

  Object(__WEBPACK_IMPORTED_MODULE_2__lib_error_js__["a" /* default */])(
    `shadowbind_component_name`,
    `Web component name "${name}" was invalid - note that names must be two ` +
      `words.`
  )
}


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = titleToTrain;
/* harmony export (immutable) */ __webpack_exports__["c"] = trainToCamel;
/* harmony export (immutable) */ __webpack_exports__["a"] = camelToTrain;
function titleToTrain (TitleCase) {
  return TitleCase.replace(
    /[A-Z]/g,
    (letter, offset) => {
      if (offset === 0) return letter.toLowerCase()
      return '-' + letter.toLowerCase()
    }
  )
}

function trainToCamel (trainCase) {
  return trainCase.replace(
    /-[a-z]/g,
    letters => letters.charAt(1).toUpperCase()
  ).replace(/-/g, '')
}

function camelToTrain (camelCase) {
  return titleToTrain(camelCase)
}


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getFormValues;
/* harmony export (immutable) */ __webpack_exports__["b"] = setFormValues;
/* unused harmony export parseForm */
function getFormValues (form) {
  return parseForm(form).values
}

function setFormValues (form, newValues) {
  const { elements } = parseForm(form)

  for (const [name, value] of Object.entries(newValues)) {
    const element = elements[name]
    const isArray = Array.isArray(element)

    if (isMultiSelect(element)) {
      setSelectValues(element, value)
    } else if (isArray || element.type === 'checkbox') {
      const checkboxes = (() => {
        if (!isArray) return [element]
        return element
      })()

      for (const checkbox of checkboxes) {
        if (value === true) {
          checkbox.setAttribute('checked', '')
        } else if (value === false) {
          checkbox.removeAttribute('checked')
        } else if (value.includes(checkbox.value)) {
          checkbox.setAttribute('checked', '')
        } else {
          checkbox.removeAttribute('checked')
        }
      }
    } else if (element.type === 'checkbox') {

    } else {
      element.value = value
    }
  }
}

function parseForm (form) {
  let values = {}
  let elements = {}
  for (let element of Array.from(form.elements)) {
    const name = element.name
    let value

    if (!name) continue

    if (element.type === 'checkbox' && element.getAttribute('value') === null) {
      value = element.checked
    } else if (element.type === 'checkbox') {
      if (element.checked) value = (values[name] || []).concat(element.value)
      else value = values[name] || []

      element = (elements[name] || []).concat(element)
    } else if (element.type === 'radio') {
      if (!values[name]) value = element.value
      element = (elements[name] || []).concat(element)
    } else if (isMultiSelect(element)) {
      value = getSelectValues(element)
    } else if (element.type === 'number') {
      value = element.value !== '' ? Number(element.value) : ''
    } else {
      value = element.value
    }

    values[name] = value
    elements[name] = element
  }
  return { values, elements }
}

function isMultiSelect (element) {
  return element.options && element.multiple
}

function getSelectValues (options) {
  let values = []
  for (const option of Array.from(options)) {
    values = option.selected ? values.concat(option.value) : values
  }
  return values
}

function setSelectValues (options, values) {
  for (const option of Array.from(options)) {
    if (values.includes(option.value)) {
      option.setAttribute('selected', '')
    } else {
      option.removeAttribute('selected')
    }
  }
}


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = deepCompare;
function deepCompare (val1, val2) {
  return JSON.stringify(val1) === JSON.stringify(val2)
}


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__publish_js__ = __webpack_require__(4);


/* harmony default export */ __webpack_exports__["a"] = (store => {
  Object(__WEBPACK_IMPORTED_MODULE_0__publish_js__["a" /* default */])(store.getState())
  return next => action => {
    next(action)
    Object(__WEBPACK_IMPORTED_MODULE_0__publish_js__["a" /* default */])(store.getState())
  }
});


/***/ })
/******/ ]);
});