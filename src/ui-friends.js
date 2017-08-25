// import store from './reducers'
import { subscribe } from '../lib/domino'

export default class UIFriends extends HTMLElement { // eslint-disable-line
  constructor () {
    super()
    subscribe(this, 'friends')
    this.root = this.attachShadow({ mode: 'open' })
    this.root.innerHTML = /* @html */`
    <h3>My Friends</h3>
    <ul>
      <li :for="friends" :key="id" on:click="sendEmail">
        <h4 :text="friends[i].name"></h4>
        <em :text="friends[i].job"></em>
        <p :html="friends[i].description"></p>
      </li>
    </ul>`
  }

  bind (friends) {
    friends['sendEmail'] = () => {}
    return friends
  }
}

window.customElements.define('ui-friends', UIFriends)
