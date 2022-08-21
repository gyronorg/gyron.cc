import { createSSRInstance, nextRender } from 'gyron'
import { renderToString } from '@gyron/dom-server'
import { createMemoryRouter, Router } from '@gyron/router'
import { App } from '@/index'
import express from 'express'
import path from 'path'
import nocache from 'nocache'
import cookieParser from 'cookie-parser'
import template from '../../public/index.html'

const app = express()

const root = __DEV__ ? path.join(__TMP__) : path.join(__dirname, __TMP__)
const clientPath = path.join(root, 'client')
const assetsPath = path.join(root, 'assets')

if (__DEV__) {
  app.use(nocache())
}
app.use(cookieParser())
app.use('/js', express.static(clientPath))
app.use('/css', express.static(clientPath))
app.use('/assets', express.static(assetsPath))

const router = createMemoryRouter({
  isSSR: true,
})

app.get('*', async (req, res) => {
  const { theme } = req.cookies

  const { root } = createSSRInstance(
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
        .replace(
          'data-server-theme',
          `class="${theme === 'dark' ? theme : ''}"`
        )
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
})

function run() {
  const port = 3000
  const server = app
    .listen(port, () => {
      console.log('listen to http://localhost:' + port)
    })
    .addListener('error', (err) => {
      console.log(err)
    })

  process.once('message', () => {
    server.close((err) => {
      if (err) console.log(err)
      process.exit(0)
    })
  })
}

run()
