import { createServer } from './rtc'
import { withGithub, withToken } from './github'
import { withHTML } from './html'
import { withBuild } from './build'
import { createEditorSocket } from './yjs'
import express from 'express'
import path from 'path'
import nocache from 'nocache'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import serverless from 'serverless-http'
import { withDBServer } from './db.server'

const port = Number(process.env.RTC_PORT) || 3000
const editorPort = Number(process.env.YJS_PORT) || 4000

async function initial() {
  // TODO netlify service check
  const { app, server } = await createServer(port)

  const wss = await createEditorSocket(editorPort)

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  const root = __DEV__ ? path.join(__TMP__) : path.join(__dirname, __TMP__)
  const clientPath = path.join(root, 'client')
  const assetsPath = path.join(root, 'assets')

  if (__DEV__) {
    app.use(nocache())
  }
  app.use(cookieParser())

  const appRouter = express.Router()

  appRouter.use('/js', express.static(clientPath))
  appRouter.use('/css', express.static(clientPath))
  appRouter.use('/assets', express.static(assetsPath))

  appRouter.get('/api/github/*', withGithub)
  appRouter.post('/api/github/*', withGithub)
  appRouter.post('/api/editor/*', withDBServer)
  appRouter.post('/api/token', withToken)
  appRouter.post('/api/build', withBuild)

  appRouter.get('*', withHTML)

  app.use('/.netlify/functions/index', appRouter)
  app.use('/', appRouter)
  return { app, server }
}

async function run() {
  const { server } = await initial()
  server.addListener('error', (err) => {
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
  initial().then(({ app }) => {
    module.exports.handler = serverless(app)
  })
} else {
  run()
}
