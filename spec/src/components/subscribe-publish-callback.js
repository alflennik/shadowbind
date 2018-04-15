import Shadowbind from '../../../src/index.js'

class SubscribePublishCallback extends window.HTMLElement {
  subscribe () {
    return {
      miles: {
        state: 'miles',
        callback: mi => {
          this.publish({ kilometers: mi * 1.6, time: '02:00:00' })
          return mi
        }
      },
      kilometers: {
        state: 'miles',
        callback: () => 'should be overridden'
      },
      milesWatcher: {
        state: 'miles',
        callback: () => 'should use callback value'
      }
    }
  }
  async getActual () {
    Shadowbind.publish({ miles: 1 })
    return [this.miles, this.kilometers, this.milesWatcher, this.time]
  }
  async getExpected () {
    return [1, 1.6, 'should use callback value', '02:00:00']
  }
  bindings ({ miles, kilometers, milesWatcher, time }) {
    this.miles = miles
    this.kilometers = kilometers
    this.milesWatcher = milesWatcher
    this.time = time
    return {}
  }
  template () {
    return ''
  }
}

Shadowbind.define(SubscribePublishCallback)
