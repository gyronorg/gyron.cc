import { nextRender } from 'gyron'
import { renderToString } from '@gyron/dom-server'
import { createMemoryRouter, Router } from '@gyron/router'
import {
  transformWithBabel,
  buildBrowserEsmWithEsbuild,
} from '@gyron/babel-plugin-jsx'
import { build } from 'esbuild'
import { App } from '@/index'
import { createServer } from './rtc'
import { withGithub, withToken } from './user'
import express from 'express'
import path from 'path'
import nocache from 'nocache'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import serverless from 'serverless-http'
import template from '../../public/index.html'

const port = Number(process.env.RTC_PORT) || 3000

// TODO netlify service check
const app = createServer(port)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const root = __DEV__ ? path.join(__TMP__) : path.join(__dirname, __TMP__)
const clientPath = path.join(root, 'client')
const assetsPath = path.join(root, 'assets')

if (__DEV__) {
  app.use(nocache())
}
app.use(cookieParser())

const router = createMemoryRouter({
  isSSR: true,
})

const appRouter = express.Router()

appRouter.use('/js', express.static(clientPath))
appRouter.use('/css', express.static(clientPath))
appRouter.use('/assets', express.static(assetsPath))

appRouter.use('/api/github/*', withGithub)
appRouter.post('/api/token', withToken)
appRouter.post('/api/build', async (req, res) => {
  const { main, sources } = req.body

  try {
    const { plugin } = buildBrowserEsmWithEsbuild(main, {
      sources,
    })
    const content = await transformWithBabel(main.code, main.name, main, true)
    const bundle = await build({
      stdin: {
        contents: content.code,
        sourcefile: main.name,
      },
      bundle: true,
      write: false,
      format: 'esm',
      plugins: [plugin],
    })

    if (bundle.warnings.length) {
      res.send({
        data: bundle.warnings.map((item) => item.text).join('\n'),
        code: 1,
      })
    } else {
      res.send({
        data: {
          text: bundle.outputFiles[0].text,
          metafile: bundle.metafile,
        },
        code: 0,
      })
    }
  } catch (e) {
    console.error(e.message)
    res.send({
      data: e.message,
      code: 1,
    })
  }
})

appRouter.get('*', async (req, res) => {
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
})

app.use('/.netlify/functions/index', appRouter)
app.use('/', appRouter)

function run() {
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

if (process.env.PUBLISH_ENV === 'netlify') {
  module.exports.handler = serverless(app)
} else {
  run()
}
