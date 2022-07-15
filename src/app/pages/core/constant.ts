import {
  CoreIndex,
  CoreRouterApi,
  CoreRouterInstallation,
  CoreRouterQuickStarted,
  CoreRouterConcepts,
  CoreDoxInstallation,
  CoreDoxQuickStarted,
  CoreDoxApi,
  CoreJSXGettingStarted,
  CoreJSXFaq,
} from '@/source'
import { wrapAsyncMdxContent } from '@/utils/mdx'
import { ContentMenu, Menu } from '@/interface/menu'

export const CORE_INDEX: ContentMenu = {
  anchor: CoreIndex,
  component: wrapAsyncMdxContent(CoreIndex),
  meta: {
    page: 'core/index',
    title: '核心 介绍',
  },
}

export const CORE_NAV: Menu = [
  {
    name: 'Router',
    children: [
      {
        path: '/core/router/installation',
        name: '安装',
        anchor: CoreRouterInstallation,
        component: wrapAsyncMdxContent(CoreRouterInstallation),
        meta: {
          group: 'Router',
          page: 'core/router/installation',
          title: 'Router 安装',
        },
      },
      {
        path: '/core/router/quick-started',
        name: '快速使用',
        anchor: CoreRouterQuickStarted,
        component: wrapAsyncMdxContent(CoreRouterQuickStarted),
        meta: {
          group: 'Router',
          page: 'core/router/quick-started',
          title: 'Router 快速使用',
        },
      },
      {
        path: '/core/router/core-concepts',
        name: '核心理念',
        anchor: CoreRouterConcepts,
        component: wrapAsyncMdxContent(CoreRouterConcepts),
        meta: {
          group: 'Router',
          page: 'core/router/concepts',
          title: 'Router 核心理念',
        },
      },
      {
        path: '/core/router/api',
        name: 'API',
        anchor: CoreRouterApi,
        component: wrapAsyncMdxContent(CoreRouterApi),
        meta: {
          group: 'Router',
          page: 'core/router/api',
          title: 'Router API',
        },
      },
    ],
  },
  {
    name: 'Dox',
    children: [
      {
        path: '/core/dox/installation',
        name: '安装',
        anchor: CoreDoxInstallation,
        component: wrapAsyncMdxContent(CoreDoxInstallation),
        meta: {
          group: 'Dox',
          page: 'core/dox/installation',
          title: 'Dox 安装',
        },
      },
      {
        path: '/core/dox/quick-started',
        name: '快速使用',
        anchor: CoreDoxQuickStarted,
        component: wrapAsyncMdxContent(CoreDoxQuickStarted),
        meta: {
          group: 'Dox',
          page: 'core/dox/quick-started',
          title: 'Dox 快速使用',
        },
      },
      {
        path: '/core/dox/api',
        name: 'API',
        anchor: CoreDoxApi,
        component: wrapAsyncMdxContent(CoreDoxApi),
        meta: {
          group: 'Dox',
          page: 'core/dox/api',
          title: 'Dox API',
        },
      },
    ],
  },
  {
    name: 'JSX',
    children: [
      {
        path: '/core/jsx/getting-started',
        name: '介绍',
        anchor: CoreJSXGettingStarted,
        component: wrapAsyncMdxContent(CoreJSXGettingStarted),
        meta: {
          group: 'JSX',
          page: 'core/dox/getting-started',
          title: 'JSX 介绍',
        },
      },
      {
        path: '/core/jsx/faq',
        name: '区别',
        anchor: CoreJSXFaq,
        component: wrapAsyncMdxContent(CoreJSXFaq),
        meta: {
          group: 'JSX',
          page: 'core/dox/faq',
          title: 'JSX 区别',
        },
      },
    ],
  },
]

export const CORE_ROUTE_MENUS = CORE_NAV.map((Menu) => Menu.children).flat()
