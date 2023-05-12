import { RequestHandler } from 'express'
import { App } from '@/index'
import { Router, createMemoryRouter } from '@gyron/router'
import { nextRender } from 'gyron'
import { renderToString } from '@gyron/dom-server'
import template from '../../public/index.html'

const router = createMemoryRouter({
  isSSR: true,
})

export const withHTML: RequestHandler = async (req, res, next) => {
  const { theme } = req.cookies

  const root = (
    <Router router={router}>
      <App />
    </Router>
  )

  await router.extra.push(req.url)

  // waiting for the view to update
  await nextRender()

  const html = await renderToString(root)

  try {
    res.send(
      template
        .replace('data-server-theme', `class="${theme || ''}"`)
        .replace(
          'Gyron.js 文档',
          `Gyron.js | ${router.extra.currentRoute.meta.title}`
        )
        .replace('<!--ssr-outlet-->', html)
        .replace(
          '<!--client-entry-css-->',
          `<link rel="stylesheet" href="/css/${__CLIENT__.css}" />`
        )
        .replace(
          '<!--client-entry-js-->',
          `<script async type="module" src="/js/${__CLIENT__.js}"></script>`
        )
    )
  } catch (e) {
    res.send(e.toString())
  }
}
