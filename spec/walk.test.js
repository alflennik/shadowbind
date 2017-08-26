import test from 'ava'
import server from './server'

test.before(() => server.start())
test.after(() => server.end())

test('Hello world browser test', async t => {
  const page = await server.goto('/spec/counter.html')
  const main = await page.evaluate(() => {
    return document.querySelector('main').innerHTML
  })
  t.deepEqual(main, 'Test value')
})
