import Shadowbind from '../../../src/index.js'

class BasicRepeater extends Shadowbind.Element {
  template () {
    return /* @html */`
      <h2 :text="beforeText" id="beforeText"></h2>
      <repeat-element :map="locations" class="loop"></repeat-element>
      <h2 :text="afterText" id="afterText"></h2>
    `
  }

  async getExpected () {
    return {
      seattle: 'Seattle',
      seattlePop: '1,000,000',
      portland: 'Portland',
      portlandPop: '900,000',
      tokyo: 'Tokyo',
      tokyoPop: '24,000,000',
      beforeText: 'Before the Locations',
      afterText: 'After the Locations'
    }
  }

  async getActual () {
    this.data({
      beforeText: 'Before the Locations',
      locations: [
        { name: 'Seattle', population: '1,000,000' },
        { name: 'Portland', population: '900,000' },
        { name: 'Tokyo', population: '24,000,000' }
      ],
      afterText: 'After the Locations'
    })

    const r = this.shadowRoot
    const r1 = this.shadowRoot.querySelectorAll('.loop')[0].shadowRoot
    const r2 = this.shadowRoot.querySelectorAll('.loop')[1].shadowRoot
    const r3 = this.shadowRoot.querySelectorAll('.loop')[2].shadowRoot

    return {
      seattle: r1.querySelector('h2').innerText,
      seattlePop: r1.querySelector('span').innerText,
      portland: r2.querySelector('h2').innerText,
      portlandPop: r2.querySelector('span').innerText,
      tokyo: r3.querySelector('h2').innerText,
      tokyoPop: r3.querySelector('span').innerText,
      beforeText: r.querySelector('#beforeText').innerText,
      afterText: r.querySelector('#afterText').innerText
    }
  }
}

class RepeatElement extends Shadowbind.Element {
  template () {
    return /* @html */`
      <h2 :text="name"></h2>
      <p>Population: <span :text="population"></span></p>
    `
  }
}

Shadowbind.define({ BasicRepeater })
Shadowbind.define({ RepeatElement })
