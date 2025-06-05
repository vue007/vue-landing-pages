import { h, render, type Plugin } from 'vue'
import { isString, merge } from 'es-toolkit'

const tooltip = (el: HTMLElement, value: string | any) => {
  const attrs = { content: '' }
  merge(attrs, {
    placement: 'top',
    trigger: 'hover',
    effect: 'dark',
    virtualRef: el,
    ...(isString(value) ? { content: value } : value),
  })

  if (attrs.content) {
    const nVNode = h('div', attrs)
    const dom = document.createElement('span')
    render(nVNode, dom)
  }
}

export const basePlugin: Plugin = {
  install: (app, options) => {
    options // keep line

    app.directive('tooltip', {
      // mounted: (el, { value }) => tooltip(el, value),
      updated: (el, { value }) => tooltip(el, value),
    })
  },
}
