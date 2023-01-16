import { createBrowserRouter, Route, Router, Routes } from '@gyron/router'
import { createSSRContext, FC } from 'gyron'
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
} from './pages'
import { storeState } from './store'
import { WrapperEditor } from '@/components/explorer/wrapper'

const isDevelopment = process.env.NODE_ENV === 'development'

const Content = FC<{
  menu: ContentMenu
  parentPath: ParentPath
}>(({ menu, parentPath }) => {
  return (
    <MdxContainer menu={menu} parentPath={parentPath}>
      <menu.component
        fallback={<Skeleton length={3} />}
        components={MdxHelper}
      />
    </MdxContainer>
  )
})

export const ExposeRoutes = FC(() => {
  return (
    <Routes>
      <Route path="" strict meta={{ title: '文档' }} element={<Home />}></Route>
      <Route path="docs" element={<Docs />}>
        {ROUTE_MENUS.map((menu) => (
          <Route
            path={menu.path}
            meta={menu.meta}
            element={<Content menu={menu} parentPath="docs" />}
          />
        ))}
      </Route>
      <Route path="core" element={<CoreDocs />}>
        <Route
          index
          meta={CORE_INDEX.meta}
          element={<Content menu={CORE_INDEX} parentPath="core" />}
        />
        {CORE_ROUTE_MENUS.map((menu) => (
          <Route
            path={menu.path}
            meta={menu.meta}
            element={<Content menu={menu} parentPath="core" />}
          />
        ))}
      </Route>
      <Route
        path="explorer"
        meta={{ title: '在线编辑器' }}
        element={<WrapperEditor />}
      />
      <Route
        path="*"
        meta={{ title: '404 未找到页面' }}
        element={<Mismatch />}
      ></Route>
    </Routes>
  )
})

export const App = FC(() => {
  return (
    <Layout>
      <ExposeRoutes />
    </Layout>
  )
})

export const app = () => {
  const router = createBrowserRouter({
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
      <App />
    </Router>,
    '#app'
  )
}
