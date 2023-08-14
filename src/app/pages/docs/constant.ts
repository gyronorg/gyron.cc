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
  Transition,
  SSR,
  ErrorBoundary,
  ApiGlobal,
  ApiInstance,
  ApiReactivity,
  ApiComponent,
  ApiContext,
  ApiVNode,
  ApiHandler,
  InstallationEn,
  InstanceEn,
  IntroductionEn,
  HelloWorldEn,
  ReactiveEn,
  ComponentEn,
  ConditionalRenderingEn,
  ListRenderingEn,
  EventBindEn,
  BuiltPropsEn,
  ContextEn,
  FormEn,
  AsyncComponentEn,
  TransitionEn,
  SSREn,
  ErrorBoundaryEn,
  ApiGlobalEn,
  ApiInstanceEn,
  ApiReactivityEn,
  ApiComponentEn,
  ApiContextEn,
  ApiVNodeEn,
  ApiHandlerEn,
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
        path: 'transition',
        name: '动画组件',
        anchor: Transition,
        component: wrapAsyncMdxContent(Transition),
        meta: {
          page: 'advanced/transition',
          title: '高级指引 动画组件',
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

export const DOCS_NAV_EN: Menu = [
  {
    name: 'Getting Started',
    path: '/en-US/docs',
    children: [
      {
        path: 'tutorial',
        name: 'Introduction',
        anchor: IntroductionEn,
        component: wrapAsyncMdxContent(IntroductionEn),
        meta: {
          page: 'guide/introduction',
          title: 'Getting Started Introduction',
        },
      },
      {
        path: 'installation',
        name: 'Installation',
        anchor: InstallationEn,
        component: wrapAsyncMdxContent(InstallationEn),
        meta: {
          page: 'guide/installation',
          title: 'Getting Started Installation',
        },
      },
      {
        path: 'instance',
        name: 'Application Instance',
        anchor: InstanceEn,
        component: wrapAsyncMdxContent(InstanceEn),
        meta: {
          page: 'guide/instance',
          title: 'Getting Started Application Instance',
        },
      },
      {
        path: 'hello-world',
        name: 'Minimal Demo',
        anchor: HelloWorldEn,
        component: wrapAsyncMdxContent(HelloWorldEn),
        meta: {
          page: 'guide/hello-world',
          title: 'Getting Started Minimal Demo',
        },
      },
      {
        path: 'reactive',
        name: 'Data Reactivity',
        anchor: ReactiveEn,
        component: wrapAsyncMdxContent(ReactiveEn),
        meta: {
          page: 'guide/reactive',
          title: 'Getting Started Data Reactivity',
        },
      },
      {
        path: 'component',
        name: 'Components',
        anchor: ComponentEn,
        component: wrapAsyncMdxContent(ComponentEn),
        meta: {
          page: 'guide/component',
          title: 'Getting Started Components',
        },
      },
      {
        path: 'conditional-rendering',
        name: 'Conditional Rendering',
        anchor: ConditionalRenderingEn,
        component: wrapAsyncMdxContent(ConditionalRenderingEn),
        meta: {
          page: 'guide/conditional-rendering',
          title: 'Getting Started Conditional Rendering',
        },
      },
      {
        path: 'list-rendering',
        name: 'List Rendering',
        anchor: ListRenderingEn,
        component: wrapAsyncMdxContent(ListRenderingEn),
        meta: {
          page: 'guide/list-rendering',
          title: 'Getting Started List Rendering',
        },
      },
      {
        path: 'event-bind',
        name: 'Event Handling',
        anchor: EventBindEn,
        component: wrapAsyncMdxContent(EventBindEn),
        meta: {
          page: 'guide/event',
          title: 'Getting Started Event Handling',
        },
      },
      {
        path: 'built-attr',
        name: 'Built-in Properties',
        anchor: BuiltPropsEn,
        component: wrapAsyncMdxContent(BuiltPropsEn),
        meta: {
          page: 'guide/built-attr',
          title: 'Getting Started Built-in Properties',
        },
      },
    ],
  },
  {
    name: 'Advanced Guide',
    path: '/en-US/docs',
    children: [
      {
        path: 'context',
        name: 'Context',
        anchor: ContextEn,
        component: wrapAsyncMdxContent(ContextEn),
        meta: {
          page: 'advanced/context',
          title: 'Advanced Guide Context',
        },
      },
      {
        path: 'form',
        name: 'Form',
        anchor: FormEn,
        component: wrapAsyncMdxContent(FormEn),
        meta: {
          page: 'advanced/form',
          title: 'Advanced Guide Form',
        },
      },
      {
        path: 'async-component',
        name: 'Async Components',
        anchor: AsyncComponentEn,
        component: wrapAsyncMdxContent(AsyncComponentEn),
        meta: {
          page: 'advanced/async-component',
          title: 'Advanced Guide Async Components',
        },
      },
      {
        path: 'transition',
        name: 'Transition Components',
        anchor: TransitionEn,
        component: wrapAsyncMdxContent(TransitionEn),
        meta: {
          page: 'advanced/transition',
          title: 'Advanced Guide Transition Components',
        },
      },
      {
        path: 'ssr',
        name: 'Server-side Rendering',
        anchor: SSREn,
        component: wrapAsyncMdxContent(SSREn),
        meta: {
          page: 'advanced/ssr',
          title: 'Advanced Guide Server-side Rendering',
        },
      },
      {
        path: 'error-boundary',
        name: 'Error Boundaries',
        anchor: ErrorBoundaryEn,
        component: wrapAsyncMdxContent(ErrorBoundaryEn),
        meta: {
          page: 'advanced/error-boundary',
          title: 'Advanced Guide Error Boundaries',
        },
      },
    ],
  },
  {
    name: 'API',
    path: '/en-US/docs',
    children: [
      {
        name: 'Global API',
        path: 'global-api',
        anchor: ApiGlobalEn,
        component: wrapAsyncMdxContent(ApiGlobalEn),
        meta: {
          page: 'api/global',
          title: 'API Global API',
        },
      },
      {
        name: 'Application API',
        path: 'instance-api',
        anchor: ApiInstanceEn,
        component: wrapAsyncMdxContent(ApiInstanceEn),
        meta: {
          page: 'api/instance',
          title: 'API Application',
        },
      },
      {
        name: 'Reactivity API',
        path: 'reactivity-api',
        anchor: ApiReactivityEn,
        component: wrapAsyncMdxContent(ApiReactivityEn),
        meta: {
          page: 'api/reactivity',
          title: 'API Reactivity',
        },
      },
      {
        name: 'Components',
        path: 'component-api',
        anchor: ApiComponentEn,
        component: wrapAsyncMdxContent(ApiComponentEn),
        meta: {
          page: 'api/component',
          title: 'API Components',
        },
      },
      {
        name: 'Context',
        path: 'context-api',
        anchor: ApiContextEn,
        component: wrapAsyncMdxContent(ApiContextEn),
        meta: {
          page: 'api/context',
          title: 'API Context',
        },
      },
      {
        name: 'VNode',
        path: 'vnode-api',
        anchor: ApiVNodeEn,
        component: wrapAsyncMdxContent(ApiVNodeEn),
        meta: {
          page: 'api/vnode',
          title: 'API VNode',
        },
      },
      {
        name: 'Error Handlers',
        path: 'handler-api',
        anchor: ApiHandlerEn,
        component: wrapAsyncMdxContent(ApiHandlerEn),
        meta: {
          page: 'api/handler',
          title: 'API Error Boundaries',
        },
      },
    ],
  },
]

export const ROUTE_MENUS = DOCS_NAV.map((Menu) => Menu.children).flat()
export const ROUTE_MENUS_EN = DOCS_NAV_EN.map((Menu) => Menu.children).flat()
