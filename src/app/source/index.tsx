const Installation = () => import('./guide/installation.mdx')
const Introduction = () => import('./guide/introduction.mdx')
const Instance = () => import('./guide/instance.mdx')
const HelloWorld = () => import('./guide/hello-world.mdx')
const Reactive = () => import('./guide/reactive.mdx')
const Component = () => import('./guide/component.mdx')
const ConditionalRendering = () => import('./guide/conditional-rendering.mdx')
const ListRendering = () => import('./guide/list-rendering.mdx')
const EventBind = () => import('./guide/event.mdx')
const BuiltProps = () => import('./guide/built-attr.mdx')

// advanced
const Context = () => import('./advanced/context.mdx')
const Form = () => import('./advanced/form.mdx')
const AsyncComponent = () => import('./advanced/async-component.mdx')
const SSR = () => import('./advanced/ssr.mdx')
const ErrorBoundary = () => import('./advanced/error-boundary.mdx')
const Transition = () => import('./advanced/transition.mdx')

// api
const ApiGlobal = () => import('./api/global.mdx')
const ApiInstance = () => import('./api/instance.mdx')
const ApiReactivity = () => import('./api/reactivity.mdx')
const ApiComponent = () => import('./api/component.mdx')
const ApiVNode = () => import('./api/vnode.mdx')
const ApiContext = () => import('./api/context.mdx')
const ApiHandler = () => import('./api/handler.mdx')

// core
const CoreIndex = () => import('./core/index.mdx')
const CoreRouterInstallation = () => import('./core/router/installation.mdx')
const CoreRouterQuickStarted = () => import('./core/router/quick-started.mdx')
const CoreRouterConcepts = () => import('./core/router/concepts.mdx')
const CoreRouterApi = () => import('./core/router/api.mdx')
const CoreDoxInstallation = () => import('./core/redux/installation.mdx')
const CoreDoxQuickStarted = () => import('./core/redux/quick-started.mdx')
const CoreDoxApi = () => import('./core/redux/api.mdx')
const CoreJSXGettingStarted = () => import('./core/jsx/getting-started.mdx')
const CoreJSXFaq = () => import('./core/jsx/faq.mdx')

// blog
const BlogReadme = () => import('./blog/readme.mdx')

export {
  Installation,
  Introduction,
  Instance,
  HelloWorld,
  Reactive,
  Component,
  ConditionalRendering,
  ListRendering,
  EventBind,
  BuiltProps,
  // Advanced
  Context,
  Form,
  AsyncComponent,
  SSR,
  ErrorBoundary,
  Transition,
  // API
  ApiGlobal,
  ApiInstance,
  ApiReactivity,
  ApiComponent,
  ApiVNode,
  ApiContext,
  ApiHandler,
  // Core
  CoreIndex,
  CoreRouterInstallation,
  CoreRouterQuickStarted,
  CoreRouterConcepts,
  CoreRouterApi,
  CoreDoxInstallation,
  CoreDoxQuickStarted,
  CoreDoxApi,
  CoreJSXGettingStarted,
  CoreJSXFaq,
  // blog
  BlogReadme
}
