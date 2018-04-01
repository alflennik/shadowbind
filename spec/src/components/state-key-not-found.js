// import { subscribe, publish } from '../../../src/index.js'
//
// class StateKeyNotFound extends HTMLElement { // eslint-disable-line
//   constructor () {
//     super()
//     subscribe(this, 'notFound')
//     this.attachShadow({ mode: 'open' })
//   }
//
//   getActual () {
//     try {
//       publish({})
//     } catch (err) {
//       return err.code || err.message
//     }
//   }
//
//   getExpected () {
//     return 'shadowbind_subscribe_key_not_found'
//   }
// }
//
// window.customElements.define('state-key-not-found', StateKeyNotFound)
