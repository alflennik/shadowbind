import test from 'ava'
import server from './src/server'

test.before(() => server.start())
test.after(() => server.end())

test('bind single elements', async t => {
  t.deepEqual(...(await server.test('basic-bindings')))
})

test('error if subscribe called without args', async t => {
  t.deepEqual(...(await server.test('subscribe-without-args')))
})

test('error if subscribe called with wrong type', async t => {
  t.deepEqual(...(await server.test('subscribe-wrong-type')))
})

test('work with web components that are not in the DOM yet', async t => {
  t.deepEqual(...(await server.test('subscribe-unattached')))
})

test('error if no shadowRoot is present in component', async t => {
  t.deepEqual(...(await server.test('no-shadow-root')))
})

test('error if closed shadowRoot is used', async t => {
  t.deepEqual(...(await server.test('closed-shadow-root')))
})

test('error if bind does not return an object', async t => {
  t.deepEqual(...(await server.test('bind-type')))
})

test('error if state key begins or ends with dot', async t => {
  t.deepEqual(...(await server.test('state-key-invalid')))
})

test('error if state key is not a string', async t => {
  t.deepEqual(...(await server.test('state-key-type')))
})

test('error if state key not found in state', async t => {
  t.deepEqual(...(await server.test('state-key-not-found')))
})

test('error if state key not found in nested state', async t => {
  t.deepEqual(...(await server.test('state-key-not-found-deep')))
})

test('error if key not found in localBindings', async t => {
  t.deepEqual(...(await server.test('bind-key-not-found')))
})

test('error if key not found in nested localBindings', async t => {
  t.deepEqual(...(await server.test('bind-key-not-found-deep')))
})

test('error if array or object bound to attribute or html', async t => {
  t.deepEqual(...(await server.test('bind-array')))
})

test('error if non function used as event handler', async t => {
  t.deepEqual(...(await server.test('event-type')))
})

test('error if css binding not an object', async t => {
  t.deepEqual(...(await server.test('css-wrong-type')))
})

test('successfully bind a basic repeater', async t => {
  t.deepEqual(...(await server.test('basic-repeater')))
})
