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

test('binds CSS classes', async t => {
  t.deepEqual(...(await server.test('bind-css-classes')))
})

test('binds CSS variables', async t => {
  t.deepEqual(...(await server.test('bind-css-variables')))
})

test('bind if removes and replaces elements', async t => {
  t.deepEqual(...(await server.test('bind-if')))
})

test('binds multiple events with on:click,touchstart', async t => {
  t.deepEqual(...(await server.test('bind-events-advanced')))
})

test('binds events with on:click', async t => {
  t.deepEqual(...(await server.test('bind-events')))
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

test('booleans simply show or hide attribute with no value', async t => {
  t.deepEqual(...(await server.test('boolean-attributes')))
})

test('error if closed shadowRoot is used', async t => {
  t.deepEqual(...(await server.test('closed-shadow-root')))
})

test('error if define called without args or invalid input', async t => {
  t.deepEqual(...(await server.test('define-type')))
})

test('error if non function used as event handler', async t => {
  t.deepEqual(...(await server.test('event-type')))
})

test('library exports available as globals on window', async t => {
  t.deepEqual(...(await server.test('global-shadowbind-support')))
})

test('error if invalid tag name used', async t => {
  t.deepEqual(...(await server.test('invalid-tag-name')))
})

test('error if no shadowRoot is present in component', async t => {
  t.deepEqual(...(await server.test('no-shadow-root')))
})

test('can bind custom element properties', async t => {
  t.deepEqual(...(await server.test('prop-binding')))
})

test('error if property is defined but wrong type', async t => {
  t.deepEqual(...(await server.test('prop-type')))
})

test('error if property is undefined', async t => {
  t.deepEqual(...(await server.test('prop-undefined')))
})

test('component uses :publish value instead of subscribed value', async t => {
  t.deepEqual(...(await server.test('publish-method')))
})

test('component uses :publish value instead of subscribed value', async t => {
  t.deepEqual(...(await server.test('publish-overrides')))
})

test('deeply nested elements are bound last to avoid thrashing', async t => {
  t.deepEqual(...(await server.test('queue-depth')))
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

test('error if binding to an element without a shadowRoot', async t => {
  t.deepEqual(...(await server.test('repeater-non-component')))
})

test('slots still work in repeaters', async t => {
  t.deepEqual(...(await server.test('repeater-slots')))
})

test('error if state key begins or ends with dot', async t => {
  t.deepEqual(...(await server.test('state-key-invalid')))
})

test('subscribe supports attributes', async t => {
  t.deepEqual(...(await server.test('subscribe-attr')))
})

test('subscribe supports jumping between types of subscriptions', async t => {
  t.deepEqual(...(await server.test('subscribe-multiple-types')))
})

test('subscribe uses most recent of multiple values', async t => {
  t.deepEqual(...(await server.test('subscribe-multiple')))
})

test('subscribe understands nested keys and ignores unknown keys', async t => {
  t.deepEqual(...(await server.test('subscribe-nested')))
})

test('subscribe works with properties', async t => {
  t.deepEqual(...(await server.test('subscribe-property')))
})

test('this.publish() should override all other subscriptions', async t => {
  t.deepEqual(...(await server.test('subscribe-publish-callback')))
})

test('subscribe supports renamed state keys', async t => {
  t.deepEqual(...(await server.test('subscribe-rename')))
})

test('subscribe detects mutations in nested state values', async t => {
  t.deepEqual(...(await server.test('subscribe-state-mutations')))
})

test('subscribe supports state', async t => {
  t.deepEqual(...(await server.test('subscribe-state')))
})

test('repeater should work in concert with tag binding', async t => {
  t.deepEqual(...(await server.test('tag-and-repeater')))
})

test('recently published data accessible through this.published', async t => {
  t.deepEqual(...(await server.test('this-published-support')))
})
