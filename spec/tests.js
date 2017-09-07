import test from 'ava'
import server from './server'

test.before(() => server.start())
test.after(() => server.end())

test('Hello world component test', async t => {
  t.deepEqual(...(await server.test('hello-world')))
})
