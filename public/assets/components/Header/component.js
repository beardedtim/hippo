import Component from '/assets/js/component.js'
import $h from '/assets/js/h.js'

class Header extends Component {
  static get observedAttributes() { return ['title', 'icon_url']; }

  render(shadow) {
    const root = $h('header', {
      id: 'app',
    }, [
      'I am the INNNER content with a title of ' + this.props.title,
      $h('link', {
        rel: 'stylesheet',
        href: '/assets/components/Header/style.css'
      })
    ])

    shadow.appendChild(root)
  }
}

export default Header