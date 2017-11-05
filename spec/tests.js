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
