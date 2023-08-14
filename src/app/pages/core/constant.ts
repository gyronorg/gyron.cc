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
  CoreIndexEn,
  CoreRouterApiEn,
  CoreRouterInstallationEn,
  CoreRouterQuickStartedEn,
  CoreRouterConceptsEn,
  CoreDoxInstallationEn,
  CoreDoxQuickStartedEn,
  CoreDoxApiEn,
  CoreJSXGettingStartedEn,
  CoreJSXFaqEn,
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

export const CORE_INDEX_EN: ContentMenu = {
  anchor: CoreIndexEn,
  component: wrapAsyncMdxContent(CoreIndexEn),
  meta: {
    page: 'core/index',
    title: 'Core Introduction',
  },
}

export const CORE_NAV: Menu = [
  {
    name: 'Router',
    path: '',
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
    name: 'Redux',
    path: '',
    children: [
      {
        path: '/core/redux/installation',
        name: '安装',
        anchor: CoreDoxInstallation,
        component: wrapAsyncMdxContent(CoreDoxInstallation),
        meta: {
          group: 'Redux',
          page: 'core/redux/installation',
          title: 'Redux 安装',
        },
      },
      {
        path: '/core/redux/quick-started',
        name: '快速使用',
        anchor: CoreDoxQuickStarted,
        component: wrapAsyncMdxContent(CoreDoxQuickStarted),
        meta: {
          group: 'Redux',
          page: 'core/redux/quick-started',
          title: 'Redux 快速使用',
        },
      },
      {
        path: '/core/redux/api',
        name: 'API',
        anchor: CoreDoxApi,
        component: wrapAsyncMdxContent(CoreDoxApi),
        meta: {
          group: 'Redux',
          page: 'core/redux/api',
          title: 'Redux API',
        },
      },
    ],
  },
  {
    name: 'JSX',
    path: '',
    children: [
      {
        path: '/core/jsx/getting-started',
        name: '介绍',
        anchor: CoreJSXGettingStarted,
        component: wrapAsyncMdxContent(CoreJSXGettingStarted),
        meta: {
          group: 'JSX',
          page: 'core/redux/getting-started',
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
          page: 'core/redux/faq',
          title: 'JSX 区别',
        },
      },
    ],
  },
]

export const CORE_NAV_EN: Menu = [
  {
    name: 'Router',
    path: '/en-US',
    children: [
      {
        path: '/en-US/core/router/installation',
        name: 'Installation',
        anchor: CoreRouterInstallationEn,
        component: wrapAsyncMdxContent(CoreRouterInstallationEn),
        meta: {
          group: 'Router',
          page: 'core/router/installation',
          title: 'Router Installation',
        },
      },
      {
        path: '/en-US/core/router/quick-started',
        name: 'Quick Start',
        anchor: CoreRouterQuickStartedEn,
        component: wrapAsyncMdxContent(CoreRouterQuickStartedEn),
        meta: {
          group: 'Router',
          page: 'core/router/quick-started',
          title: 'Router Quick Start',
        },
      },
      {
        path: '/en-US/core/router/core-concepts',
        name: 'Core Concepts',
        anchor: CoreRouterConceptsEn,
        component: wrapAsyncMdxContent(CoreRouterConceptsEn),
        meta: {
          group: 'Router',
          page: 'core/router/concepts',
          title: 'Router Core Concepts',
        },
      },
      {
        path: '/en-US/core/router/api',
        name: 'API',
        anchor: CoreRouterApiEn,
        component: wrapAsyncMdxContent(CoreRouterApiEn),
        meta: {
          group: 'Router',
          page: 'core/router/api',
          title: 'Router API',
        },
      },
    ],
  },
  {
    name: 'Redux',
    path: '/en-US',
    children: [
      {
        path: '/en-US/core/redux/installation',
        name: 'Installation',
        anchor: CoreDoxInstallationEn,
        component: wrapAsyncMdxContent(CoreDoxInstallationEn),
        meta: {
          group: 'Redux',
          page: 'core/redux/installation',
          title: 'Redux Installation',
        },
      },
      {
        path: '/en-US/core/redux/quick-started',
        name: 'Quick Start',
        anchor: CoreDoxQuickStartedEn,
        component: wrapAsyncMdxContent(CoreDoxQuickStartedEn),
        meta: {
          group: 'Redux',
          page: 'core/redux/quick-started',
          title: 'Redux Quick Start',
        },
      },
      {
        path: '/en-US/core/redux/api',
        name: 'API',
        anchor: CoreDoxApiEn,
        component: wrapAsyncMdxContent(CoreDoxApiEn),
        meta: {
          group: 'Redux',
          page: 'core/redux/api',
          title: 'Redux API',
        },
      },
    ],
  },
  {
    name: 'JSX',
    path: '/en-US',
    children: [
      {
        path: '/en-US/core/jsx/getting-started',
        name: 'Introduction',
        anchor: CoreJSXGettingStartedEn,
        component: wrapAsyncMdxContent(CoreJSXGettingStartedEn),
        meta: {
          group: 'JSX',
          page: 'core/redux/getting-started',
          title: 'JSX Introduction',
        },
      },
      {
        path: '/en-US/core/jsx/faq',
        name: 'Differences',
        anchor: CoreJSXFaqEn,
        component: wrapAsyncMdxContent(CoreJSXFaqEn),
        meta: {
          group: 'JSX',
          page: 'core/redux/faq',
          title: 'JSX Differences',
        },
      },
    ],
  },
]

export const CORE_ROUTE_MENUS = CORE_NAV.map((Menu) => Menu.children).flat()
export const CORE_ROUTE_MENUS_EN = CORE_NAV_EN.map(
  (Menu) => Menu.children
).flat()
