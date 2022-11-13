// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createSSRInstance, nextRender, h } from '@gyron/runtime'
import { renderToString } from '@gyron/dom-server'
import { createMemoryRouter, generateNestedRoutes, Router } from '@gyron/router'
import { buildClient, buildAPP } from './base.mjs'
import { JSDOM } from 'jsdom'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ProgressBar from 'progress'

const tempPath = 'dist'

async function getRoutes(vnode) {
  const tp = generateNestedRoutes(vnode.children)
  const routes = []
  while (tp.length) {
    const route = tp.pop()
    if (route.path === '*') {
      routes.push('/404')
    } else {
      routes.push(route.extra.regexpPath)
    }
    if (route.extra.children.length) {
      tp.push(...route.extra.children)
    }
  }
  return routes
}

async function render(vnode, url, clientMeta) {
  const router = createMemoryRouter({
    isSSR: true,
  })

  const { root } = createSSRInstance(h(Router, { router: router }, vnode))

  await router.extra.replace(url)

  // waiting for the view to update
  await nextRender()

  const html = await renderToString(root)

  return fs
    .readFileSync(path.join(process.cwd(), 'public/index.html'), {
      encoding: 'utf-8',
    })
    .replaceAll(
      'Gyron.js 文档',
      `Gyron.js | ${router.extra.currentRoute.meta?.title || '文档'}`
    )
    .replace('<!--ssr-outlet-->', html)
    .replace(
      '<!--client-entry-css-->',
      `<link rel="stylesheet" href="/client/${clientMeta.css}" />`
    )
    .replace(
      '<!--client-entry-js-->',
      `<script async type="module" src="/client/${clientMeta.js}"></script>`
    )
}

buildClient(false, tempPath).then((appMeta) => {
  // many web standards
  global.document = new JSDOM().window.document
  buildAPP().then(async ({ App, ExposeRoutes }) => {
    const node = ExposeRoutes()
    const routes = await getRoutes(node())
    const bar = new ProgressBar(
      `${chalk.blue('Page being rendered:')} [:bar] :current/:total`,
      {
        total: routes.length,
      }
    )
    for (const url of routes) {
      const html = await render(h(App), url, appMeta)
      const urls = url.slice(1).split('/')
      const name = urls.pop()
      if (urls.length) {
        const dir = `dist/${urls.join('/')}`
        fs.ensureDirSync(dir)
        fs.writeFileSync(`${dir}/${name}.html`, html, { encoding: 'utf-8' })
      } else {
        fs.writeFileSync(`dist/${name ? name : 'index'}.html`, html, {
          encoding: 'utf-8',
        })
      }
      bar.tick()
    }
    fs.copySync('public/sitemap', `${tempPath}/sitemap`)
    fs.copySync('public/assets', `${tempPath}/assets`)
    fs.rmSync('dist/app', { recursive: true, force: true })
  })
})
