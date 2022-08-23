const Installation = () => import('./guide/installation.mdx')
const Introduction = () => import('./guide/introduction.mdx')
const Instance = () => import('./guide/instance.mdx')
const HelloWorld = () => import('./guide/hello-world.mdx')
const Reactive = () => import('./guide/reactive.mdx')
const Component = () => import('./guide/component.mdx')
const ConditionalRendering = () => import('./guide/conditional-rendering.mdx')
const ListRendering = () => import('./guide/list-rendering.mdx')
const EventBind = () => import('./guide/event.mdx')

// advanced
const Context = () => import('./advanced/context.mdx')
const Form = () => import('./advanced/form.mdx')
const AsyncComponent = () => import('./advanced/async-component.mdx')
const SSR = () => import('./advanced/ssr.mdx')
const ErrorBoundary = () => import('./advanced/error-boundary.mdx')

// api
const ApiGlobal = () => import('./api/global.mdx')
const ApiReactivity = () => import('./api/reactivity.mdx')
const ApiComponent = () => import('./api/component.mdx')
const ApiContext = () => import('./api/context.mdx')
const ApiBoundaries = () => import('./api/boundaries.mdx')

// core
const CoreIndex = () => import('./core/index.mdx')
const CoreRouterInstallation = () => import('./core/router/installation.mdx')
const CoreRouterQuickStarted = () => import('./core/router/quick-started.mdx')
const CoreRouterConcepts = () => import('./core/router/concepts.mdx')
const CoreRouterApi = () => import('./core/router/api.mdx')
const CoreDoxInstallation = () => import('./core/dox/installation.mdx')
const CoreDoxQuickStarted = () => import('./core/dox/quick-started.mdx')
const CoreDoxApi = () => import('./core/dox/api.mdx')
const CoreJSXGettingStarted = () => import('./core/jsx/getting-started.mdx')
const CoreJSXFaq = () => import('./core/jsx/faq.mdx')

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
  Context,
  Form,
  AsyncComponent,
  SSR,
  ErrorBoundary,
  ApiGlobal,
  ApiReactivity,
  ApiComponent,
  ApiContext,
  ApiBoundaries,
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
}
