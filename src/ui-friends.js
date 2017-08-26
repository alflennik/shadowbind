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
      <li :for="friend of friends" :key="id" on:click="sendEmail">
        <h4 :text="friend.name"></h4>
        <em :text="friend.job"></em>
        <p :html="friend.description"></p>
      </li>
    </ul>`
  }

  bind (friends) {
    friends['sendEmail'] = e => {
      const id = e.target.getAttribute('id')
    }
    return friends
  }
}

window.customElements.define('ui-friends', UIFriends)
