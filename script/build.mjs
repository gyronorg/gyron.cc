// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
global.__DEV__ = false
global.__WARN__ = true
import { createSSRInstance, nextRender, h } from '@gyron/runtime'
import { renderToString } from '@gyron/dom-server'
import { createMemoryRouter, generateNestedRoutes, Router } from '@gyron/router'
import { escape } from '@gyron/shared'
import { buildClient, buildAPP } from './base.mjs'
import { JSDOM } from 'jsdom'
import DOMPurify from 'dompurify'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ProgressBar from 'progress'
import ora from 'ora'

const spinner = ora('Building...')
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

const normalDescription =
  '简单零依赖的响应式框架(Simple zero-dependency responsive framework that uses jsx syntactic sugar to describe the UI)' +
  '简单 只需要了解JavaScript基本语法和jsx语法糖就可以完全构建一个可交互的应用程序。使用脚手架还可以快速开始本地应用。' +
  '组件 以函数作为组件的基础元素，就可以灵活的组织页面，并且可以追踪数据变化。还可以使用更多选项让组件可缓存，在大型项目中收益更明显。' +
  '小巧 核心代码仅9kb(gzip)左右，但是功能却十分完善。不仅支持SPA模式，还支持SSR模式，只需要做少许改动就可以让组件支持SSR。'

async function render(vnode, url, clientMeta) {
  const router = createMemoryRouter({
    isSSR: true,
  })

  const { root } = createSSRInstance(h(Router, { router: router }, vnode))

  await router.extra.replace(url)

  // waiting for the view to update
  await nextRender()

  const html = await renderToString(root)

  const { window } = new JSDOM(html)

  const { sanitize } = DOMPurify(window)

  const description =
    window.document.querySelector('article')?.textContent || normalDescription

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
    .replaceAll('{%description%}', sanitize(escape(description)))
}

spinner.start()
buildClient(false, tempPath).then((appMeta) => {
  // many web standards
  const jsdom = new JSDOM()
  global.window = jsdom.window
  global.document = jsdom.window.document
  global.crypto = {
    getRandomValues: (array) => {
      for (let i = 0, l = array.length; i < l; i++) {
        array[i] = Math.floor(Math.random() * 256)
      }
      return array
    },
  }
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
    spinner.succeed(chalk.green('Build Complete!'))
  })
})
