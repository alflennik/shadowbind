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
  goto: async url => {
    const page = await browser.newPage()
    await page.goto(`http://localhost:1122${url}`)
    return page
  }
}

module.exports = server
