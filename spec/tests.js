import test from 'ava'
import server from './src/server'

test.before(() => server.start())
test.after(() => server.end())

test('should bind single elements', async t => {
  t.deepEqual(...(await server.test('test-bind')))
})
