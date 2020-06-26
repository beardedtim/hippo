class Component extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    this._shadow = shadow
    this.props = {}
    this.state = {}

    this._render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const handler = this.shouldUpdate || (() => oldValue !== newValue)

    if (handler(name, oldValue, newValue)) {
      this.props[name] = newValue
      this._render()
    }
  }

  _render() {
    this._shadow.innerHTML = ''
    this.render(this._shadow)
  }

  setState(value) {
    if (typeof value === 'function') {
      this.state = value(this.state)
    } else {
      this.state = Object.assign({}, this.state, value)
    }

    window.requestAnimationFrame(this._render.bind(this))
  }
}

export default Component