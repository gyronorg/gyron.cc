const InstallationEn = () => import('./guide/installation.mdx')
const IntroductionEn = () => import('./guide/introduction.mdx')
const InstanceEn = () => import('./guide/instance.mdx')
const HelloWorldEn = () => import('./guide/hello-world.mdx')
const ReactiveEn = () => import('./guide/reactive.mdx')
const ComponentEn = () => import('./guide/component.mdx')
const ConditionalRenderingEn = () => import('./guide/conditional-rendering.mdx')
const ListRenderingEn = () => import('./guide/list-rendering.mdx')
const EventBindEn = () => import('./guide/event.mdx')
const BuiltPropsEn = () => import('./guide/built-attr.mdx')

// advanced
const ContextEn = () => import('./advanced/context.mdx')
const FormEn = () => import('./advanced/form.mdx')
const AsyncComponentEn = () => import('./advanced/async-component.mdx')
const SSREn = () => import('./advanced/ssr.mdx')
const ErrorBoundaryEn = () => import('./advanced/error-boundary.mdx')
const TransitionEn = () => import('./advanced/transition.mdx')

// api
const ApiGlobalEn = () => import('./api/global.mdx')
const ApiInstanceEn = () => import('./api/instance.mdx')
const ApiReactivityEn = () => import('./api/reactivity.mdx')
const ApiComponentEn = () => import('./api/component.mdx')
const ApiVNodeEn = () => import('./api/vnode.mdx')
const ApiContextEn = () => import('./api/context.mdx')
const ApiHandlerEn = () => import('./api/handler.mdx')

// core
const CoreIndexEn = () => import('./core/index.mdx')
const CoreRouterInstallationEn = () => import('./core/router/installation.mdx')
const CoreRouterQuickStartedEn = () => import('./core/router/quick-started.mdx')
const CoreRouterConceptsEn = () => import('./core/router/concepts.mdx')
const CoreRouterApiEn = () => import('./core/router/api.mdx')
const CoreDoxInstallationEn = () => import('./core/redux/installation.mdx')
const CoreDoxQuickStartedEn = () => import('./core/redux/quick-started.mdx')
const CoreDoxApiEn = () => import('./core/redux/api.mdx')
const CoreJSXGettingStartedEn = () => import('./core/jsx/getting-started.mdx')
const CoreJSXFaqEn = () => import('./core/jsx/faq.mdx')

// blog
const BlogReadmeEn = () => import('./blog/readme.mdx')

export {
  InstallationEn,
  IntroductionEn,
  InstanceEn,
  HelloWorldEn,
  ReactiveEn,
  ComponentEn,
  ConditionalRenderingEn,
  ListRenderingEn,
  EventBindEn,
  BuiltPropsEn,
  // Advanced
  ContextEn,
  FormEn,
  AsyncComponentEn,
  SSREn,
  ErrorBoundaryEn,
  TransitionEn,
  // api
  ApiGlobalEn,
  ApiInstanceEn,
  ApiReactivityEn,
  ApiComponentEn,
  ApiVNodeEn,
  ApiContextEn,
  ApiHandlerEn,
  // core
  CoreIndexEn,
  CoreRouterInstallationEn,
  CoreRouterQuickStartedEn,
  CoreRouterConceptsEn,
  CoreRouterApiEn,
  CoreDoxInstallationEn,
  CoreDoxQuickStartedEn,
  CoreDoxApiEn,
  CoreJSXGettingStartedEn,
  CoreJSXFaqEn,
  // blog
  BlogReadmeEn,
}
