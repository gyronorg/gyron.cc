// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
global.__DEV__ = false
global.__WARN__ = true
import * as dotenv from 'dotenv'
dotenv.config()

import { createSSRInstance, nextRender, h } from '@gyron/runtime'
import { renderToString } from '@gyron/dom-server'
import { createMemoryRouter, generateNestedRoutes, Router } from '@gyron/router'
import { escape } from '@gyron/shared'
import { buildClient, buildAPP, buildServer } from './base.mjs'
import { JSDOM } from 'jsdom'
import DOMPurify from 'dompurify'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import ProgressBar from 'progress'
import ora from 'ora'
import glob from 'glob'

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

const normalDescriptionEn =
  'A simple zero-dependency responsive framework that uses jsx syntactic sugar to describe the UI. ' +
  'Simple - Just basic JavaScript and jsx syntax knowledge is required to build a fully interactive application. Scaffolding can also be used to quickly bootstrap local apps.' +
  'Components - Using functions as the basic component elements allows flexible page organization and tracks data changes. Caching and other advanced options can optimize performance in large projects.' +
  'Tiny size - The core code is around 9kb (gzipped) but the functionality is quite complete. Not only does it support SPA, but also SSR with minor modifications to make components universal.'

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
    window.document.querySelector('article')?.textContent ||
    window.document.querySelector('#_description')?.textContent ||
    (url.startsWith('/en-US') ? normalDescriptionEn : normalDescription)

  return fs
    .readFileSync(path.join(process.cwd(), 'public/index.html'), {
      encoding: 'utf-8',
    })
    .replaceAll(
      'Gyron.js 文档',
      `Gyron.js | ${router.extra.currentRoute.meta?.title || '文档'}`
    )
    .replace('{%lang%}', url?.startsWith('/en-US') ? 'en-US' : 'zh-CN' || 'zh-CN')
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
      const html = await render(
        h(App, { lang: url.startsWith('/en-US') ? 'en-US' : 'zh-CN' }),
        url,
        appMeta
      )
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
    fs.copySync('public/robots.txt', `${tempPath}/robots.txt`)
    fs.copySync('node_modules/gyron/dist/browser', `${tempPath}/assets/gyron`)
    const files = glob.sync('node_modules/esbuild*')
    for (const file of files) {
      fs.copySync(
        file,
        tempPath + '/server/node_modules/' + file.replace('node_modules/', '')
      )
    }
    fs.writeFileSync(
      'dist/server/package.json',
      JSON.stringify({
        main: './index.js',
        dependencies: {
          esbuild: '0.14.49',
          bufferutil: '4.0.7',
          '@babel/preset-typescript': '7.21.0',
        },
      })
    )
    fs.rmSync('dist/app', { recursive: true, force: true })
    await buildServer(false, null, appMeta)
    spinner.succeed(chalk.green('Build Complete!'))
  })
})
