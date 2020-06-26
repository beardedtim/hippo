import Component from '/assets/js/component.js'
import $h from '/assets/js/h.js'

class App extends Component {
  render(shadow) {
    const root = $h('div', {
      id: 'app',
    }, [
      'I am the text content!',
      $h('link', {
        rel: 'stylesheet',
        href: '/assets/components/App/style.css'
      }),
      $h('t-header', {
        title: 'Foo fighters', click: () => {
          alert('You clicked the Foo Fighters')
        }
      }),
      $h('t-header', {
        title: 'Everlast', click: () => {
          alert('You clicked Everlast')
        }
      }),
      $h('button', {
        click: () => {
          this.setState(({ clicks = 0, ...rest }) => ({
            clicks: clicks + 1,
            ...rest
          }))
        }
      }, `You have clicked the button ${this.state.clicks || 0} times`)
    ])

    shadow.appendChild(root)
  }
}

export default App