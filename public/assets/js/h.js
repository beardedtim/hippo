const TextType = Symbol('text')

const eventHandlers = ['click']

export const createElement = (type, attrs = {}, children = '') => {
  if (type === TextType) {
    return document.createTextNode(children)
  }

  const el = document.createElement(type)

  for (const [key, value] of Object.entries(attrs)) {
    if (eventHandlers.includes(key)) {
      el.addEventListener(key, value)
    } else {
      el.setAttribute(key, value)
    }
  }

  if (children) {
    const frag = document.createDocumentFragment()

    if (typeof children === 'string') {
      frag.appendChild(createElement(TextType, {}, children))
    } else {
      for (const child of children) {
        if (typeof child === 'string') {
          frag.appendChild(createElement(TextType, {}, child))
        } else {
          frag.appendChild(child)
        }
      }
    }

    el.appendChild(frag)
  }

  return el
}

export default createElement