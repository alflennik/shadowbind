const puppeteer = require('puppeteer')
const liveServer = require('live-server')

let browser

// Factor out code needed in all tests
const server = {
  start: async () => {
    liveServer.start({
      port: 1122,
      open: false,
      logLevel: 0
    })
    browser = await puppeteer.launch()
    return browser
  },
  end: () => {
    browser.close()
    liveServer.shutdown()
  },
  test: async componentName => {
    const page = await browser.newPage()
    await page.goto(`http://localhost:1122/spec/#${componentName}`)
    return page.evaluate(async () => {
      return [ await getActual(), await getExpected() ] // eslint-disable-line
    })
  }
}

module.exports = server
