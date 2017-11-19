import test from 'ava'
import server from './src/server'

test.before(() => server.start())
test.after(() => server.end())

test('should bind single elements', async t => {
  t.deepEqual(...(await server.test('basic-bindings')))
})

test('should throw when subscribe called without args', async t => {
  t.deepEqual(...(await server.test('subscribe-without-args')))
})

test('should throw when subscribe called with wrong type', async t => {
  t.deepEqual(...(await server.test('subscribe-wrong-type')))
})

test('should work with web components that are not in the DOM yet', async t => {
  t.deepEqual(...(await server.test('subscribe-unattached')))
})

test('should throw when no shadowRoot is present in component', async t => {
  t.deepEqual(...(await server.test('no-shadow-root')))
})

test('should throw when closed shadowRoot is used', async t => {
  t.deepEqual(...(await server.test('closed-shadow-root')))
})

test('should throw if bind does not return an object', async t => {
  t.deepEqual(...(await server.test('bind-type')))
})

test('should throw if state key begins or ends with dot', async t => {
  t.deepEqual(...(await server.test('state-key-invalid')))
})

test('should throw if state key is not a string', async t => {
  t.deepEqual(...(await server.test('state-key-type')))
})

test('should throw if state key not found in state', async t => {
  t.deepEqual(...(await server.test('state-key-not-found')))
})

test('should throw if state key not found in nested state', async t => {
  t.deepEqual(...(await server.test('state-key-not-found-deep')))
})

test('should throw if key not found in localBindings', async t => {
  t.deepEqual(...(await server.test('bind-key-not-found')))
})

test('should throw if key not found in nested localBindings', async t => {
  t.deepEqual(...(await server.test('bind-key-not-found-deep')))
})

test('should throw if array or object bound to attribute or html', async t => {
  t.deepEqual(...(await server.test('bind-array')))
})

test('should throw if non function used as event handler', async t => {
  t.deepEqual(...(await server.test('event-type')))
})

test('should throw if css binding not an object', async t => {
  t.deepEqual(...(await server.test('css-wrong-type')))
})
