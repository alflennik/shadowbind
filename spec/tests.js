import test from 'ava'
import server from './src/server'

test.before(() => server.start())
test.after(() => server.end())

test('bind single elements', async t => {
  t.deepEqual(...(await server.test('basic-bindings')))
})

test('successfully bind a basic repeater', async t => {
  t.deepEqual(...(await server.test('basic-repeater')))
})

test('error if array or object bound to attribute or html', async t => {
  t.deepEqual(...(await server.test('bind-array')))
})

test('binds events with on:click', async t => {
  t.deepEqual(...(await server.test('bind-events')))
})

test('binds multiple events with on:click,touchstart', async t => {
  t.deepEqual(...(await server.test('bind-events-advanced')))
})

test('error if key not found in nested localBindings', async t => {
  t.deepEqual(...(await server.test('bind-key-not-found-deep')))
})

test('error if key not found in localBindings', async t => {
  t.deepEqual(...(await server.test('bind-key-not-found')))
})

test('error if bind is defined but not a function', async t => {
  t.deepEqual(...(await server.test('bind-method-type')))
})

test('can bind to nested web components', async t => {
  t.deepEqual(...(await server.test('bind-nested')))
})

test(':tag binding is fully functional', async t => {
  t.deepEqual(...(await server.test('bind-tag')))
})

test('error if bind does not return an object', async t => {
  t.deepEqual(...(await server.test('bind-type')))
})

test('error if closed shadowRoot is used', async t => {
  t.deepEqual(...(await server.test('closed-shadow-root')))
})

test('error if non function used as event handler', async t => {
  t.deepEqual(...(await server.test('event-type')))
})

test('error if invalid tag name used', async t => {
  t.deepEqual(...(await server.test('invalid-tag-name')))
})

test('error if no shadowRoot is present in component', async t => {
  t.deepEqual(...(await server.test('no-shadow-root')))
})

// test('component uses :publish value instead of subscribed value', async t => {
//   t.deepEqual(...(await server.test('publish-method')))
// })

test('can bind custom element properties', async t => {
  t.deepEqual(...(await server.test('prop-binding')))
})

test('error if property is defined but wrong type', async t => {
  t.deepEqual(...(await server.test('prop-type')))
})

test('error if property is undefined', async t => {
  t.deepEqual(...(await server.test('prop-undefined')))
})

test('repeater can add and remove elements (including all)', async t => {
  t.deepEqual(...(await server.test('repeater-add-remove')))
})

test('error if bind property is wrong type', async t => {
  t.deepEqual(...(await server.test('repeater-bind-type')))
})

test('can bind nested repeaters', async t => {
  t.deepEqual(...(await server.test('repeater-nested')))
})

test('error if not binding an array to a repeater', async t => {
  t.deepEqual(...(await server.test('repeater-type')))
})

test('slots still work in repeaters', async t => {
  t.deepEqual(...(await server.test('repeater-slots')))
})

test('error if binding to an element without a shadowRoot', async t => {
  t.deepEqual(...(await server.test('repeater-without-shadow')))
})

// test('error if state key begins or ends with dot', async t => {
//   t.deepEqual(...(await server.test('state-key-invalid')))
// })

// test('error if state key not found in nested state', async t => {
//   t.deepEqual(...(await server.test('state-key-not-found-deep')))
// })

// test('error if state key not found in state', async t => {
//   t.deepEqual(...(await server.test('state-key-not-found')))
// })

// test('error if state key is not a string', async t => {
//   t.deepEqual(...(await server.test('state-key-type')))
// })

// test('work with web components that are not in the DOM yet', async t => {
//   t.deepEqual(...(await server.test('subscribe-unattached')))
// })

// test('error if subscribe called without args', async t => {
//   t.deepEqual(...(await server.test('subscribe-without-args')))
// })

// test('error if subscribe called with wrong type', async t => {
//   t.deepEqual(...(await server.test('subscribe-wrong-type')))
// })
