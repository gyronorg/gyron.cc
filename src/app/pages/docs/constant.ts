import { Menu } from '@/interface/menu'
import {
  Installation,
  Instance,
  Introduction,
  HelloWorld,
  Reactive,
  Component,
  ConditionalRendering,
  ListRendering,
  EventBind,
  BuiltProps,
  Context,
  Form,
  AsyncComponent,
  SSR,
  ErrorBoundary,
  ApiGlobal,
  ApiInstance,
  ApiReactivity,
  ApiComponent,
  ApiContext,
  ApiVNode,
  ApiHandler,
} from '@/source'
import { wrapAsyncMdxContent } from '@/utils/mdx'

export const DOCS_NAV: Menu = [
  {
    name: '入门指南',
    path: '/docs',
    children: [
      {
        path: 'tutorial',
        name: '介绍',
        anchor: Introduction,
        component: wrapAsyncMdxContent(Introduction),
        meta: {
          page: 'guide/introduction',
          title: '入门指南 介绍',
        },
      },
      {
        path: 'installation',
        name: '安装',
        anchor: Installation,
        component: wrapAsyncMdxContent(Installation),
        meta: {
          page: 'guide/installation',
          title: '入门指南 安装',
        },
      },
      {
        path: 'instance',
        name: '应用实例',
        anchor: Instance,
        component: wrapAsyncMdxContent(Instance),
        meta: {
          page: 'guide/instance',
          title: '入门指南 应用实例',
        },
      },
      {
        path: 'hello-world',
        name: '最小示范',
        anchor: HelloWorld,
        component: wrapAsyncMdxContent(HelloWorld),
        meta: {
          page: 'guide/hello-world',
          title: '入门指南 最小示范',
        },
      },
      {
        path: 'reactive',
        name: '数据响应',
        anchor: Reactive,
        component: wrapAsyncMdxContent(Reactive),
        meta: {
          page: 'guide/reactive',
          title: '入门指南 数据响应',
        },
      },
      {
        path: 'component',
        name: '组件',
        anchor: Component,
        component: wrapAsyncMdxContent(Component),
        meta: {
          page: 'guide/component',
          title: '入门指南 组件',
        },
      },
      {
        path: 'conditional-rendering',
        name: '条件渲染',
        anchor: ConditionalRendering,
        component: wrapAsyncMdxContent(ConditionalRendering),
        meta: {
          page: 'guide/conditional-rendering',
          title: '入门指南 条件渲染',
        },
      },
      {
        path: 'list-rendering',
        name: '列表渲染',
        anchor: ListRendering,
        component: wrapAsyncMdxContent(ListRendering),
        meta: {
          page: 'guide/list-rendering',
          title: '入门指南 列表渲染',
        },
      },
      {
        path: 'event-bind',
        name: '事件处理',
        anchor: EventBind,
        component: wrapAsyncMdxContent(EventBind),
        meta: {
          page: 'guide/event',
          title: '入门指南 事件处理',
        },
      },
      {
        path: 'built-attr',
        name: '内置属性',
        anchor: BuiltProps,
        component: wrapAsyncMdxContent(BuiltProps),
        meta: {
          page: 'guide/built-attr',
          title: '入门指南 内置属性',
        },
      },
    ],
  },
  {
    name: '高级指引',
    path: '/docs',
    children: [
      {
        path: 'context',
        name: '上下文',
        anchor: Context,
        component: wrapAsyncMdxContent(Context),
        meta: {
          page: 'advanced/context',
          title: '高级指引 上下文',
        },
      },
      {
        path: 'form',
        name: '表单',
        anchor: Form,
        component: wrapAsyncMdxContent(Form),
        meta: {
          page: 'advanced/form',
          title: '高级指引 表单',
        },
      },
      {
        path: 'async-component',
        name: '异步组件',
        anchor: AsyncComponent,
        component: wrapAsyncMdxContent(AsyncComponent),
        meta: {
          page: 'advanced/async-component',
          title: '高级指引 异步组件',
        },
      },
      {
        path: 'ssr',
        name: '服务端渲染',
        anchor: SSR,
        component: wrapAsyncMdxContent(SSR),
        meta: {
          page: 'advanced/ssr',
          title: '高级指引 服务端渲染',
        },
      },
      {
        path: 'error-boundary',
        name: '错误边界',
        anchor: ErrorBoundary,
        component: wrapAsyncMdxContent(ErrorBoundary),
        meta: {
          page: 'advanced/error-boundary',
          title: '高级指引 错误边界',
        },
      },
    ],
  },
  {
    name: 'API',
    path: '/docs',
    children: [
      {
        name: '全局API',
        path: 'global-api',
        anchor: ApiGlobal,
        component: wrapAsyncMdxContent(ApiGlobal),
        meta: {
          page: 'api/global',
          title: 'API 全局API',
        },
      },
      {
        name: '应用API',
        path: 'instance-api',
        anchor: ApiInstance,
        component: wrapAsyncMdxContent(ApiInstance),
        meta: {
          page: 'api/instance',
          title: 'API 应用',
        },
      },
      {
        name: '响应式API',
        path: 'reactivity-api',
        anchor: ApiReactivity,
        component: wrapAsyncMdxContent(ApiReactivity),
        meta: {
          page: 'api/reactivity',
          title: 'API 响应式',
        },
      },
      {
        name: '组件',
        path: 'component-api',
        anchor: ApiComponent,
        component: wrapAsyncMdxContent(ApiComponent),
        meta: {
          page: 'api/component',
          title: 'API 组件',
        },
      },
      {
        name: '上下文',
        path: 'context-api',
        anchor: ApiContext,
        component: wrapAsyncMdxContent(ApiContext),
        meta: {
          page: 'api/context',
          title: 'API 上下文',
        },
      },
      {
        name: '节点',
        path: 'vnode-api',
        anchor: ApiVNode,
        component: wrapAsyncMdxContent(ApiVNode),
        meta: {
          page: 'api/vnode',
          title: 'API 节点',
        },
      },
      {
        name: '错误边界',
        path: 'handler-api',
        anchor: ApiHandler,
        component: wrapAsyncMdxContent(ApiHandler),
        meta: {
          page: 'api/handler',
          title: 'API 错误边界',
        },
      },
    ],
  },
]

export const ROUTE_MENUS = DOCS_NAV.map((Menu) => Menu.children).flat()
