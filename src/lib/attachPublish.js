import bindComponent from './bindComponent.js'

export default function attachPublish (component) {
  component.publish = bindings => {
    bindComponent(component, bindings)
  }
}

window.attachPublish = attachPublish
