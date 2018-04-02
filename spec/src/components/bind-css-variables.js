import * as Shadowbind from '../../../src/index.js'

class BindCssVariables extends window.HTMLElement {
  getActual () {
    this.publish({
      widthValue: '100px',
      heightValue: null
    })

    const elementProperty = (selector, property) => {
      return this.shadowRoot
        .querySelector(selector)
        .style
        .getPropertyValue(property)
    }

    return {
      width: elementProperty('#width100', '--width'),
      height: elementProperty('#clearHeight', '--height')
    }
  }
  getExpected () {
    return {
      width: '100px',
      height: ''
    }
  }
  template () {
    return /* @html */ `
      <div css:width="widthValue" id="width100"></div>
      <div css:height="heightValue" id="clearHeight"></div>
    `
  }
}

Shadowbind.define(BindCssVariables)
