# ![Shadowbind](Shadowbind.png)

> Radically Simple Web Components

A tiny JavaScript framework for the post-framework age - build reusable HTML Elements that interoperate with any other framework.

```JavaScript
import Shadowbind from 'shadowbind'

class MyComponent extends Shadowbind.Element {
  subscribe() {
    // Mark the data you want to use
    return { image: 'attr' } // image attribute
  }
  bindings({ image }) {
    // Optionally format data for display
    return { image: image || 'default-img.png' }
  }
  template() {
    // Internal HTML with databinding support
    return `<img attr:src="image">`
  }
}

Shadowbind.define({ MyComponent })
```
```html
<my-component image="url.png"></my-component>
```

- Prioritizes simplicity: no compiler, no build scripts, no CLI, no dev server, no JSX, no Typescript mandate, and no use of planned JS features.
- Unopinionated about build tools: package your project with Webpack, Rollup, Parcel or any bundler, or don’t - if you want you can import all your components through script tags and skip the build step altogether.
- Just like React, you declare the way you want your data to be displayed, and the framework does the work of automatically keeping that data in sync.
- Integrates elegantly with Redux or any central datastore library for cleanly managing incredibly complex state.
- Produces components that interoperate with any other framework, like React, Angular, Vue, Polymer, Ember, Aurelia... or whatever you might want to use. But powerful enough that you don’t need any other framework.
- Simple HTML-based templates. No JSX, just JS, HTML and CSS.
- As a web component, gains access to awesome features like scoped CSS, templates, strict encapsulation with shadow DOM and slots for sharing HTML with outside components.
- Only 18KB (6KB gzipped!) with no dependencies.

Disadvantages:
- Requires full web component support for the immediate future, which is currently present in 78-85% of browsers depending on the market. Shadowbind is ideal for hybrid apps, admin interfaces, or web apps not targeted at the general public. Polyfill support is planned.
- Web components are new and the widget selection is still growing. On the bright side, thanks to the interoperability of web components, you will never need to look for the “Shadowbind version” of a library. Just use any web component.
- SEO support for web components requires using a web service to serve a content-only version of your site to search engines based on their user agent string.

## Contents

- [Getting Started](#getting-started)
- [Why Web Components?](#why-web-components)
- [JavaScript API](#javascript-api)
- [Component API](#component-api)
- [HTML API](#html-api)
- [Forms API](#forms-api)
- [Notes On Tooling](#notes-on-tooling)
- [Routing](#routing)
- [Roadmap](#roadmap)
- [Philosophy](#philosophy)

## Getting Started

### Simple Setup (Fastest to Get Working)

Run `npm install --save shadowbind` in your project folder.

Run `npm install -g live-server`.

Create `first-component.js` in your project folder.

```js
class FirstComponent extends Shadowbind.Element {
  template() {
    return `<h1>I am a web component!</h1>`
  }
}

Shadowbind.define({ FirstComponent }) // Uses the global Shadowbind variable
```

Create `index.html`.

```html
<html>
<body>
  <first-component></first-component>
  <script src="node_modules/shadowbind/dist/shadowbind.js"></script>
  <script src="first-component.js"></script>
</body>
</html>
```

Run `live-server`.

You should see "I am a web component!"

### Bundler-Based Setup (Recommended)
Bundlers are complicated, but in 99% of projects, the benefits of introducing a build process outweigh the inconvenience of maintaining it. Bundlers allow you to use the import keyword, apply build optimizations like minification, and access rich ecosystems of plugins from performance budgets to SASS compilers.

Run `npm install --save shadowbind`

Run `npm install -g parcel-bundler`

Create `src/app-root.js`

```js
import Shadowbind from 'shadowbind'

class AppRoot extends Shadowbind.Element {
  template() {
    return `<h1>I am the app root</h1>`
  }
}

Shadowbind.define({ AppRoot })
```

Create `src/index.js`

```js
import './app-root.js'
```

Create `index.html`

```html
<html>
<body>
  <app-root></app-root>
  <script src="src/index.js"></script>
</body>
</html>
```

Run `parcel index.html`

### Full Starter Project
For an even more sophisticated setup, this repo includes an starter project including Redux, Webpack and an example of some basic interactivity. Download the example folder and follow the instructions in its readme.

## Why Web Components?
With web components, and their key feature, Shadow DOM, you can write components that look like a single HTML tag (`<my-cart></my-cart>`) but contain hidden internal functionality that frameworks aren't able to see and don't need to understand. This is the key allowing your components to interoperate seamlessly with Angular, React, Vue, Ember, Aurelia and future frameworks as well.

### Why Not Vanilla Web Components?
Web components do not provide a mechanism for declarative databinding. You have to watch for changes to your data and manually update DOM nodes - a recipe for complex imparative logic and equally complex bugs.

```js
import store from './my-store'
import actions from './my-actions'

class MyComponent extends Shadowbind.Element {
  static get observedAttributes() {
    return ['message']
  }
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    const template = document.createElement('template')
    template.innerHTML = this.template()
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    const message = this.getAttribute('message')
    this.apiData = '123'
    this.button = this.shadowRoot.querySelector('#my-button')
    this.button.addEventListener('click', this.buttonClicked)
    this.button.innerText = this.getAttribute('message')
    this.apiRootUrl = store.getState().apiRootUrl
    store.subscribe(() => {
      this.apiRootUrl = store.getState().apiRootUrl
    })
  }
  attributeChangedCallback(attribute, oldValue, newValue) {
    if (attribute === 'message') {
      this.button.innerText = newValue
    }
  }
  buttonClicked() {
    actions.callApi(this.apiRootUrl, this.apiData)
  }
  template() {
    return `
      <button id="my-button"></button>
    `
  }
}

customElements.define('my-component', MyComponent)
```

The Shadowbind version implements the exact same functionality in a much more readable way.

```js
import Shadowbind from 'shadowbind'
import actions from './my-actions'

class MyComponent extends Shadowbind.Element {
  constructor() {
    super()
    this.data({ apiData: '123' })
  }
  subscribe() {
    return { message: 'attr', apiRootUrl: 'state' }
  }
  buttonClicked() {
    const { apiRootUrl, apiData } = this.data()
    actions.callApi(apiRootUrl, apiData)
  }
  template() {
    return `
      <button on:click="buttonClicked" :text="message"></button>
    `
  }
}

Shadowbind.define({ MyComponent })
```

### Sharing Shadowbind Components
Sharing open source components is amazingly easy:

- Install: `npm install --save my-component`
- Import it somewhere: `import 'my-component'`
- Then just use it! `<my-component></my-component>`

The days of manually copying and pasting jQuery plugin code, CSS and HTML snippets into your project are over. And these components can be used anywhere - a detail that bears repeating.

Your component should bundle down to a single file and include Shadowbind as a peer dependency.

Incidentally, this remarkable developer experience caries over to microservice workflows where pieces of an app are stored in separate repositories with separate teams, or where components are stored in a central location like npm private and are reused across a large number of projects.

## JavaScript API
The Shadowbind variable is accessible through `import Shadowbind from 'shadowbind'`. It is also accessible as a global variable - simply make sure the script file is included before your components.

#### `Shadowbind.Element`:
The base class for your components that extends HTMLElement.
```js
class MyComponent extends Shadowbind.Element {
}
```

#### `Shadowbind.define({ MyComponent })`:
Initializes your components.

```js
import Shadowbind from 'shadowbind'
import MyComponent from './my-component'
import OtherComponent from './other-component'
import Products from './products'

Shadowbind.define({
  MyComponent,
  CartItems,
  'product-list': Products
})
```

Converts TitleCase names to valid train-case element names. You can also provide explicit names as shown with `'product-list'` above.

Note that web components must have a '-' in their name, as per the web component standard:

- `Shadowbind.define({ MyComponent })` defines `<my-component></my-component>`
- `Shadowbind.define({ CartItems })` defines `<cart-items></cart-items>`
- `Shadowbind.define({ Products })` is invalid, since web components must be two words, i.e. have a hyphen

#### `Shadowbind.publish(state)`:
Set the global state of your app, designed for integrating with non-Redux data sources (for Redux there is included middleware - see `Shadowbind.redux` below).

```JavaScript
import Shadowbind from 'shadowbind'
import getAppStateFromServer from './my-app'

getAppStateFromServer().then(appData => {
  Shadowbind.publish(appData)
})
```

- Do not use `Shadowbind.publish()` at the same time as the `Shadowbind.redux` middleware - one will override changes from the other.
- As described in the subscribe section below, your components can subscribe to values in the global state like this:
  ```js
  class MyComponent extends Shadowbind.Element {
    subscribe() {
      return { keyInGlobalState: 'state' }
    }
    // ...
  }
  ```
- You should run `Shadowbind.publish()` before your components are defined so you can access the default state in your components.
```js
import Shadowbind from 'shadowbind'
import MyComponent1 from './components/my-component-1'
import MyComponent2 from './components/my-component-2'
import MyComponent3 from './components/my-component-3'
import getInitialState from './get-initial-state'

getInitialState().then(initialState => {
  Shadowbind.publish(initialState)
  Shadowbind.define({
    MyComponent1,
    MyComponent2,
    MyComponent3
  })
})
  ```

#### `Shadowbind.redux`:
Shadowbind comes with Redux middleware that will automatically publish whenever your store changes.

```js
import { createStore, applyMiddleware } from 'redux'
import Shadowbind from 'shadowbind'
import rootReducer from './root-reducer'

const store = createStore(rootReducer, applyMiddleware(Shadowbind.redux))
```

Run `createStore()` before `Shadowbind.define()` so your components have access to the initial state.

```js
// index.js
import Shadowbind from 'shadowbind'
import MyComponent from './my-component'
import store from './store'

Shadowbind.define({ MyComponent })
```

## Component API
Shadowbind provides methods to efficiently pipe data into your components and manage it effectively.

All methods added by Shadowbind:
```js
class ShadowbindMethods extends Shadowbind.Element {
  subscribe() {}
  beforeBindCallback() {}
  afterBindCallback() {}
  bindings(data) {}
  template() {}
}
```

Shadowbind-provided methods available within the component:
```js
this.form()
this.data()
```

Web component methods like `attributeChangedCallback()`, `connectedCallback()`, etc. work just like they do in any web component.

### Subscriptions: Introduction

```JavaScript
class MyComponent extends Shadowbind.Element {
  subscribe() {
    return {
      width: ['attr', 'prop'],
      height: ['attr', 'prop'],
      fillType: 'state'
    }
  }
}
```

The `subscribe()` method identifies the data you want to use in your component. You can subscribe to data from attributes (`'attr'`), properties (`'prop'`) or state (`'state'`).

Attributes are key-value pairs in your html.

```html
<video-player theme="dark"></video-player>
```
```js
class VideoPlayer extends Shadowbind.Element {
  subscribe() {
    return { theme: 'attr' }
  }
  bindings(data) {
    // { theme: 'dark' }
  }
}
```

Attributes are converted from train-case (with hypens) to camelCase to help bridge the gap between case-insensitive html and JavaScript-compatible variable names.

```html
<add-to-cart product-sku="123"></add-to-cart>
```
```js
class AddToCart extends Shadowbind.Element {
  subscribe() {
    return { productSku: 'attr' }
  }
}
```

Properties are methods that can be called on the component with JavaScript.

```html
<video-player></video-player>
```
```js
document.querySelector('video-player').play(videoId)
```
```js
class VideoPlayer extends Shadowbind.Element {
  play(videoId) {
    // Custom logic goes here
  }
}
```

Shadowbind will attach property methods for you if you subscribe to them.

```js
class BlogPost extends Shadowbind.Element {
  subscribe() {
    return { content: 'prop' }
  }
  template() {
    return `<main :html="content"></main>`
  }
}
```
```js
document.querySelector('blog-post').content('I am the blog post content')
```

State is a global store of data for your app - familiar to users of Redux.

```js
Shadowbind.publish({ counter: 10 })
```
```js
class MyCounter extends Shadowbind.Element {
  subscribe() {
    return { counter: 'state' }
  }
  bindings(data) {
    // { counter: 10 }
  }
}
```

### Subscriptions: Advanced
- You can bind multiple sources to a single key. The most recently changed value will be used.
```js
  subscribe() {
    return { firstName: ['attr', 'prop'] }
  }
```
- You can remap the names of the keys:
```js
  subscribe() {
    return { title: { prop: 'setTitle' } }
  }
```
- You can remap multiple keys:
```js
  subscribe() {
    return { name: [{ prop: 'productName' }, { prop: 'nameOfProduct' }] }
  }
```
- You can format the data with a callback:
```JavaScript
  subscribe() {
    return {
      quantity: { attr: 'quantity', callback: quantity => Number(quantity) }
    }
  }
```
- For state, you can access nested values with a dot:
```js
Shadowbind.publish({ theme: { color: '#bada55' }})
```
```js
  subscribe() {
    return { color: { state: 'theme.color' } }
  }
```

### Managing Data

#### `this.data()`:
- Returns an object containing the latest subscribed data.
```JavaScript
  class MyComponent extends Shadowbind.Element {
    onButtonClick(event) {
      const { counter } = this.data()
      if (counter < 10) incrementCounter()
    }
  }
```

#### `this.data({ abc: 123 })`:
- Overrides the values for the given keys and refreshes the component.
- `this.data({})` triggers Shadowbind to refresh the component with no changes to the current data.

#### `this.form()`:

The form API is described in detail in the [forms section](#forms-api).

### Bindings
The data you store in your component will be in a raw, pure format not suited to display to a user. Quantities of money lack dollar signs, datetime objects are not formatted as “2 minutes ago”, and derivative values like the value of the products in the cart may not be present. This is where `bindings()` comes in.

```javascript
class MyWebComponent extends Shadowbind.Element {
  bindings({ price }) {
    return { price: formatAsMoney(price) }
  }
  template() {
    return `
      <div :text="price"></div>
    `
  }
}
```

Bindings also help you set default values and organize logic that is dependent on interconnected data (like whether a product is in the cart).

```js
class MyComponent extends Shadowbind.Element {
  bindings({ id, name = '', price = 0, quantity = 0, cart = {} }) {
    return {
      name,
      quantity,
      alreadyInCart: cart[id] !== undefined,
      price: formatAsMoney(price)
    }
  }
  template() {
    return `
      <h4 :text="name"></h4>
      <div class="quantity-in-cart" :show="alreadyInCart">
        <span :text="quantity"></span> already in cart
      </div>
      <div class="price" :text="price"></div>
    `
  }
}
```

### Lifecycle Events
Shadowbind components come with lifecycle events that allow you to inject logic at critical moments.

```js
class LifecycleTester extends Shadowbind.Element {
  constructor() {} // Called when element is created

  // Built into all web components
  connectedCallback() {}
  disconnectedCallback() {}
  adoptedCallback() {}
  attributeChangedCallback(attributeName, oldValue, newValue) {}

  // From Shadowbind
  beforeBindCallback() {}
  afterBindCallback() {}
}
```

#### `constructor`:
Called when the component is created but before it is attached to the DOM.

#### `connectedCallback`:
Called when element is attached to the DOM, i.e. created.

#### `disconnectedCallback`:
Called when element is removed from the DOM, i.e. destroyed.

#### `adoptedCallback`:
Called when an element moves between documents, which almost never happens. Safe to ignore.

#### `attributeChangedCallback`:
Called when an attribute changes.

#### `beforeBindCallback`:
Called before bindings are applied by Shadowbind.

#### `afterBindCallback`:
Called after the bindings are applied.

### Selecting Elements
This is not unique to Shadowbind, but it is worth noting how to select DOM elements for use in your methods.

```js
class AudioWrapper extends Shadowbind.Element {
  constructor() {
    super()
    this.audioElement = this.shadowRoot.querySelector('audio')
  }
  template() {
    return `
      <audio src="123.mp3"></audio>
    `
  }
}
```

Safari's shadow DOM implementation [does not currently support](https://caniuse.com/#feat=shadowdomv1) some CSS selectors including nth-child and nth-of-type.

### Selecting Slotted Elements
All web components come with support for slotted content, where HTML elements are shared between the component and its outside.

```html
<fancy-input>
  <input type="text">
</fancy-input>
```
```js
class FancyInput extends Shadowbind.Element {
  getSlotContent(event) {
    this.slottedInput = event.target.assignedNodes()
  }
  template() {
    return `
      <div class="fancy-style">
        <slot on:slotchange="getSlotContent"></slot>
      </div>
    `
  }
}
```

Slots can be named, allowing you to have several slots in your component.

```html
<blog-post>
  <div slot="title">My First Post<div>
  <div slot="date">A few minutes ago</div>
  <div slot="content">My post content</div>
</blog-post>
```
```js
class BlogPost extends Shadowbind.Element {
  updateSlot(event) {
    const slotName = event.target.getAttribute('name')
    this[slotName] = event.target.assignedNodes()
    // Now this.content, this.date and this.title refer to the DOM nodes!
  }
  template() {
    return `
      <div on:slotchange="updateSlot">
        <h1>
          <slot name="title"></slot>
        </h1>
        <div class="date">
          <slot name="date"></slot>
        </div>
        <main>
          <slot name="content"></slot>
        </main>
      </div>
    `
  }
}
```

## HTML API
Shadowbind's declarative binding syntax bridges the gap between your data and its expression in the HTML document.

```js
class MyComponent extends Shadowbind.Element {
  bindings(data) {
    return {
      value1: 123,
      value2: 456,
      isFancy: true
      innerContent: `<p>Some HTML content</p>`,
      isHidden: true
    }
  }
  template() {
    return `
      <div attr:hello="value1"></div>
      <div :text="value2"></div>
      <button class:fancy="isFancy"></button>
      <main :html="innerContent"></main>
      <div :if="isHidden"></div>
      <div :show="isHidden"></div>
    `
  }
}
```

Results in:

```html
<div hello="123" attr:hello="value1"></div>
<div :text="value2">456</div>
<button class="fancy" class:fancy="isFancy"></button>
<main :html="innerContent">
  <p>Some HTML content</p>
</main>
<span sb:p="1"></span>
<div style="display: none !important" :show="isHidden"></div>
```

- For all bindings, a value of `null` or `undefined` will result in the element not being updated. The current value will remain unchanged.
- Unlike other binding languages, the values are "dumb" - not supporting logic like ternary statements, if statements, function calls, etc. This helps keep your HTML clean and simple. This logic is instead contained in the `bindings()` section.

#### `attr:my-attr="value"`:
```html
<img attr:src="heroImageLink" attr:alt="heroImageAltText">
```
- Used to set html attribute values.
- If `false`, the attribute is removed. If `true`, it is added with no text content:
  ```html
  <input type="checkbox" attr:checked="isChecked" checked>
  ```
- Arrays and objects cannot be bound this way (unless you call `JSON.stringify()` on them first), and numbers are converted to strings.

#### `prop:my-prop="value"`:
```html
<product-detail prop:set-product="rawData"></product-detail>
```
- Calls the `setProduct()` method on the `product-detail` component with the the argument `rawData`.
- Can be used to bind raw data like arrays and objects.
- Train case (`prop:set-quantity`) will be converted into camelCase (`element.setQuantity()`)
- Unlike attributes, which can be anything, prop will produce an error if the function is not explicitly defined on the element.
- The method will be called every time Shadowbind databinds the element.

#### `on:click="myEvent"`:
```js
class MyComponent extends Shadowbind.Element {
  checkout(event) {
    return false // Stop propagation
  }
  validate(event) {
  }
  buttonMousedown(event) {
  }
  buttonMouseup (event) {
  }
  template() {
    return `
      <form on:submit="checkout">
        <input type="text" on:input,blur="validate">
        <button on:mousedown="buttonMousedown"
        on:mouseup="buttonMouseup"></button>
      </form>
    `
  }
}
```
- Attaches event listeners.
- You can apply the same event listener to multiple events with a comma-separated list.
- Event propagation can be stopped by returning `false` from the event handler.

#### `css:my-variable="value"`:
```js
class MyComponent extends Shadowbind.Element {
  bindings() {
    return {
    	primaryThemeColor: '#bada55'
    }
  }
  template() {
    return `
      <style>
        h3 { color: var(—-header-color); }
      </style>
      <h3 css:header-color="primaryThemeColor"></h3>
    `
  }
}
```
- Sends dynamic values to CSS using CSS variables.
- If the value is `false`, the variable is removed.

#### `class:my-class="value"`:
```html
<p class:is-collapsed="collapseButtonClicked"><p>
```
If the value of `collapseButtonClicked` is not `false`, the given class will be added.

#### `:text="value"`:
```html
<h1 :text="headline"></h1>
```
Sets the inner text of the element.

#### `:html`:
```html
<main :html="articleParagraphs"></main>
```
Sets the inner HTML of the element.

#### `:if="value"`:
```html
<h2 :if="cartEmpty">Your Cart is Empty<h2>
<cart-products :if="cartPresent"></cart-products>
```
Removes elements from the DOM if `cartEmpty` is `false`.

#### `:show="value"`:
```html
<div :show="shouldBeShown"></div>
```
Sets `display: none !important` on the element if `shouldBeShown` is `false`.

#### `:tag="tagName"`:
```html
<span :tag="currentPage"></span>
```
Sets the HTML element tag to the provided value, e.g. `'about-page'`, `'contact-page'`, `span` or `h3`. Useful for routing.

#### `:map="myList"`:
```html
<app-product :map="products"></app-product>
```
- Creates one component for each object in an array.
- The `data()` property is called for each, overriding the internal data of the component.
- Must be used with web components, not normal elements like `div`.

```js
class MyComponent extends Shadowbind.Element {
  bindings() {
    return {
      foodList: [
        { food: 'hamburger', taste: 10 },
        { food: 'pizza', taste: 10 },
        { food: 'pasta', taste: 9 },
        { food: 'sushi', taste: 9 }
      ]
    }
  }
  template() {
    return `
      <my-food :map="foodList"></my-food>
    `
  }
}

class MyFood extends Shadowbind.Element {
  template() {
    return `
      Tested food: <span :text="food"></span>
      Taste level: <span :text="taste"></span>
    `
  }
}
```

#### `:value="formElementValue"`:
Detailed in the forms section below.

## Forms API

When it comes to the most unpredictable of domains - user input - Shadowbind does not attempt to manage the complex and ever-changing state, instead deferring that responsibility to Redux, which is directly targeted at this type of challenge. Shadowbind provides APIs for bulk reading and setting form values, two-way binding with Redux, and handling form change and submission events.

### Typical Example

```js
import Shadowbind from 'shadowbind'
import actions from './redux-actions.js'

class SimpleContactForm extends Shadowbind.Element {
  onSubmit(event) {
    const formContents = this.form() // { email: 'me@me.com', message: 'hi!' }
    actions.sendEmail(formContents)
    this.form({ email: '', message: '' })
  }
  template() {
    return `
      <form on:submit="onSubmit">
        <input type="text" name="email">
        <textarea name="message"></textarea>
      </form>
    `
  }
}

Shadowbind.define({ SimpleContactForm })
```

`<form on:submit="onSubmit">` attaches a submit event handler. No special form-specific APIs are needed for detecting the submit event - just the normal Shadowbind event binding will do.

`this.form()` gets the all the values in the form.

`this.form({ email: '', message: '' })` clears the form.

### Two-Way Binding

```js
class NewTodoForm extends Shadobind.Element {
  subscribe() {
    return { newTodo: 'state' }
  }
  onInput(event) {
    actions.validateNewTodo(this.form())
  }
  onSubmit(event) {
    action.createTodo(this.form())
  }
  template() {
    return `
      <form on:input="onInput" on:submit="onSubmit">
        <input type="text" name="text" :value="newTodo.text">
        <div :text="newTodo.invalidMessage" :if="newTodo.isInvalid"></div>
      </form>
    `
  }
}
```

`on:input="onInput"` attaches an event that will be called whenever any of the form inputs change.

The `onInput(event)` handler sends the form contents to Redux with a Redux action.

`:value="newTodo.text"` binds the value stored in `newTodo.text` to the input. _This allows you to manipulate the content of the form inputs simply by changing the state in Redux._ For example, you could clear the form simply by setting `newTodo.text` to `''` in a reducer.

### Form API Details

#### `this.form()`:

- Return the values of all your form inputs for the first form in your component.
```html
  <form>
    <input type="number" name="numberTest" value="2000">
    <input type="radio" name="radioTest" value="abc">
    <input type="radio" name="radioTest" value="def" checked>
    <select name="selectTest">
      <option value="123" selected>123</option>
      <option value="456">456</option>
    </select>
    <select name="multipleSelectTest" multiple>
      <option value="Allen" selected>Allen</option>
      <option value="Christie" selected>Christie</option>
    </select>
    <input type="checkbox" name="singleToggleTest">
    <input type="checkbox" name="multipleCheckboxTest" value="a">
    <input type="checkbox" name="multipleCheckboxTest" value="b">
    <input type="checkbox" name="multipleCheckboxTest" value="c" checked>
  </form>
```
```js
  {
    numberTest: 2000,
    radioTest: 'def',
    selectTest: '123',
    multipleSelectTest: ['Allen', 'Christie'],
    singleToggleTest: false,
    multipleCheckboxTest: ['c']
  }
```
- Single checkboxes without a value attribute will be treated as booleans (see the example above)
- Form elements must be wrapped in a form tag or they will not be detected.

#### `this.form({ myText: 'abc' })`:
- Sets the value of the input with the name `myText` to `'abc'`
```html
<input type="text" name="firstName">
<textarea name="message"></textarea>
```
```js
this.form({ firstName: '', message: 'Type your message' })
```
- Only the provided fields will be updated.
- Checkboxes and multi-select boxes are returned and manipulated with arrays.
```html
<input type="checkbox" name="assigned" value="Billy">
<input type="checkbox" name="assigned" value="Brian">
<input type="checkbox" name="assigned" value="Barry">
```
```js
this.form() // { assigned: ['Billy'] }
```
```js
this.form({ assigned: ['Billy', 'Barry'] })
```

#### `<input type="text" :value="myValue">`:
  - The input value will be kept in sync with your data.
  - You cannot use both `this.form({ name: value })` and `:value` on the same input. You have to choose one.
  - If you do not "tell" Shadowbind every time the user types a character, their changes will be erased!
  ```js
  class MyForm extends Shadowbind.Element {
    subscribe() {
      return { selectedDay: 'state' } // The source of your data
    }
    trackFormChanges(event) { // Called whenever the form changes
      saveChangesToForm(this.form()) // Record the new values
    }
    template() {
      return `
        <form on:input="trackFormChanges">
          <select name="day" :value="selectedDay">
            <option value="fri">Friday</option>
          </select>
        </form>
      `
    }
  }
  ```
  ```js
    import Shadowbind from 'shadowbind'

    // A simplistic example not using Redux
    function saveChangesToForm(formData) {
      let selectedDay = formData.day
      if (selectedDay === 'mon') selectedDay = 'fri'
      Shadowbind.publish({ selectedDay })
    }
  ```
  - This pattern requires more up-front setup, but in workflows where you need your form to know which form elements have been edited or focused, to support clearing or bulk setting values, the ability to control the form values directly in Redux is indispensable.

## Notes On Tooling
Shadowbind works out of the box with current browsers so most tooling will work without any special setup. However, there are some steps you can take to improve your experience working with Shadowbind.

- Installing support for HTML syntax highlighting within template tags is a must. Here are instructions [for Atom](https://github.com/gandm/language-babel#javascript-tagged-template-literal-grammar-extensions), [for VSCode](https://marketplace.visualstudio.com/items?itemName=natewallace.angular2-inline) and [for Sublime Text](https://github.com/Thom1729/Sublime-JS-Custom/#custom_tagged_literals-object).
- For some components, particularly with extensive CSS styles, it is desirable to split the CSS and/or HTML into separate files. This is easy to set up with Webpack's raw loader.
```js
import Shadowbind from 'shadowbind'
import styles from './my-component.css' // Use Webpack's raw-loader
import content from './my-component.html'

class MyComponent extends Shadowbind.Element {
  template() {
    return `<style>${styles}</styles>${content}`
  }
}
```

## Routing
A router component is on the roadmap, but in the meantime Shadowbind works with any router library. Here is one suggested implementation:

- Store the current route in Redux.
- Use `app-link` components to capture internal navigation:
```html
<app-link href="my/url/path">This is an internal link</app-link>
```
- Use a router library like [Navigo](https://github.com/krasimir/navigo) to capture navigation events in the URL bar.
- Display the desired page component with the `:tag` binding:
```html
<div :tag="currentPage"></div>
```

## Roadmap
- Production-ready: Shadowbind is brand-new tech, so there are undiscovered bugs and edge cases to address. Please open issues!
- Polyfills: Add support, installable as a separate package, for existing web component polyfills, making Shadowbind usable for mass-market web apps or websites.
- Router: to be implemented as a separate component.
- Plugins: Install npm packages that extend the binding system or add useful methods to your components.
- Repeater: The `:map` binding is powerful enough for most use cases, but it’s easy to imagine situations where a more manual repeater would be preferred. Perhaps as a plugin, depending on its size.
- Error boundaries: contain localized errors in gigantic apps.
- Type definitions for TypeScript and Flow.
- Test library that provides better ergonomics than Selenium or Puppeteer by themselves.

## Philosophy
Shadowbind's goal is not to reinvent all standards like React, to cover all possible use cases like Angular, or to build server rendering pipelines with the complexity and sophistication of a nuclear submarine. Instead, Shadowbind's aim is to become a rock-solid nexus in a growing community of innovative components and apps. Shadowbind aspires to the consistency, modesty and reliability (boringness?) of jQuery. Enabling *you* to create something exciting. I can't wait to see what you build with it.

Oh, and don't forget to leave a star ;)
