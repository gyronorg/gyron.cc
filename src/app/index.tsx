import { createBrowserRouter, Route, Router, Routes } from '@gyron/router'
import { createSSRContext, FC, useBeforeUpdate } from 'gyron'
import { MdxHelper } from './components/helper'
import { MdxContainer, ParentPath } from './components/mdx'
import { Mismatch } from './components/mismatch'
import { Skeleton } from './components/skeleton'
import { ContentMenu } from './interface/menu'
import { Layout } from './layout'
import {
  CORE_INDEX,
  CoreDocs,
  CORE_ROUTE_MENUS,
  Docs,
  Home,
  ROUTE_MENUS,
  Editor,
  BlogDocs,
  BLOG_ROUTE_MENUS,
  ROUTE_MENUS_EN,
  CORE_ROUTE_MENUS_EN,
  BLOG_ROUTE_MENUS_EN,
} from './pages'
import { storeState } from './store'
import { Lang } from './components/translate'
import { $t, TranslateProvider } from './langs'
import { CORE_INDEX_EN } from './pages/core'

const base = process.env.PUBLISH_BASE

const Content = FC<{
  menu: ContentMenu
  parentPath: ParentPath
  lang: Lang
}>(({ menu, parentPath, lang }) => {
  return (
    <TranslateProvider lang={lang}>
      <MdxContainer menu={menu} parentPath={parentPath}>
        <menu.component
          fallback={<Skeleton length={3} />}
          components={MdxHelper}
        />
      </MdxContainer>
    </TranslateProvider>
  )
})

export const ExposeRoutes = FC(() => {
  return (
    <Routes>
      <Route path={Lang.EN}>
        <Route
          path=""
          strict
          meta={{ title: $t('StringLiteral_54_25_54_29', Lang.EN) }}
          element={
            <TranslateProvider lang={Lang.EN}>
              <Home />
            </TranslateProvider>
          }
        ></Route>
        <Route path="docs" element={<Docs lang={Lang.EN} />}>
          {ROUTE_MENUS_EN.map((menu) => (
            <Route
              path={menu.path}
              meta={menu.meta}
              element={
                <Content menu={menu} parentPath="en-US/docs" lang={Lang.EN} />
              }
            />
          ))}
        </Route>
        <Route path="core" element={<CoreDocs lang={Lang.EN} />}>
          <Route
            index
            meta={CORE_INDEX_EN.meta}
            element={
              <Content
                menu={CORE_INDEX_EN}
                parentPath="en-US/core"
                lang={Lang.EN}
              />
            }
          />
          {CORE_ROUTE_MENUS_EN.map((menu) => (
            <Route
              path={menu.path}
              meta={menu.meta}
              element={
                <Content menu={menu} parentPath="en-US/core" lang={Lang.EN} />
              }
            />
          ))}
        </Route>
        <Route path="blog" element={<BlogDocs lang={Lang.EN} />}>
          {BLOG_ROUTE_MENUS_EN.map((menu) => (
            <Route
              path={menu.path}
              meta={menu.meta}
              element={
                <Content menu={menu} parentPath="en-US/blog" lang={Lang.EN} />
              }
            />
          ))}
        </Route>
        <Route
          path="explorer"
          meta={{ title: $t('StringLiteral_103_25_103_44', Lang.EN) }}
          element={
            <TranslateProvider lang={Lang.EN}>
              <Editor />
            </TranslateProvider>
          }
        />
        <Route
          path="*"
          meta={{ title: $t('StringLiteral_158_23_158_34', Lang.EN) }}
          element={<Mismatch />}
        ></Route>
      </Route>
      <Route
        path=""
        strict
        meta={{ title: $t('StringLiteral_110_23_110_27', Lang.ZH) }}
        element={
          <TranslateProvider lang={Lang.ZH}>
            <Home />
          </TranslateProvider>
        }
      ></Route>
      <Route path="docs" element={<Docs lang={Lang.ZH} />}>
        {ROUTE_MENUS.map((menu) => (
          <Route
            path={menu.path}
            meta={menu.meta}
            element={<Content menu={menu} parentPath="docs" lang={Lang.ZH} />}
          />
        ))}
      </Route>
      <Route path="core" element={<CoreDocs lang={Lang.ZH} />}>
        <Route
          index
          meta={CORE_INDEX.meta}
          element={
            <Content menu={CORE_INDEX} parentPath="core" lang={Lang.ZH} />
          }
        />

        {CORE_ROUTE_MENUS.map((menu) => (
          <Route
            path={menu.path}
            meta={menu.meta}
            element={<Content menu={menu} parentPath="core" lang={Lang.ZH} />}
          />
        ))}
      </Route>
      <Route path="blog" element={<BlogDocs lang={Lang.ZH} />}>
        {BLOG_ROUTE_MENUS.map((menu) => (
          <Route
            path={menu.path}
            meta={menu.meta}
            element={<Content menu={menu} parentPath="blog" lang={Lang.ZH} />}
          />
        ))}
      </Route>
      <Route
        path="explorer"
        meta={{ title: $t('StringLiteral_153_23_153_42', Lang.ZH) }}
        element={<Editor />}
      />
      <Route
        path="*"
        meta={{ title: $t('StringLiteral_158_23_158_34', Lang.ZH) }}
        element={<Mismatch />}
      ></Route>
    </Routes>
  )
})

export const App = FC<{ lang: Lang }>(({ isSSR, lang = Lang.ZH }) => {
  return (
    <Layout lang={lang}>
      <ExposeRoutes />
    </Layout>
  )
})

export const app = (lang = Lang.ZH) => {
  const router = createBrowserRouter({
    base: base || '/',
    beforeEach: (from, to, next) => {
      next()
    },
    afterEach: (from, to) => {
      if (to.meta) {
        const title = `Gyron.js | ${to.meta.title}`
        document.title = title
        const og = document.querySelector(
          'meta[property="og:title"]'
        ) as HTMLMetaElement
        if (og) {
          og.content = title
        }
      }
      if (from.path !== to.path) {
        for (const k in storeState.guidance) {
          Reflect.deleteProperty(storeState.guidance, k)
        }
      }
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  })
  return createSSRContext({ message: {} }).render(
    <Router router={router}>
      <App lang={lang} />
    </Router>,
    '#app'
  )
}
