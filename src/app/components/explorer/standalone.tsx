import { FC, VNode, createInstance, nextRender, onAfterMount } from 'gyron'
import defaultCss from './default.css.txt'

interface StandaloneProps {
  namespace: string
}

export function useMountWithStandalone(f: () => void) {
  onAfterMount(() => {
    nextRender(f)
  })
}

export function getEnvironment(namespace: string) {
  const standalone = document.querySelector(
    `#container_${namespace}`
  ) as HTMLIFrameElement
  return {
    window: standalone.contentWindow,
    document: standalone.contentDocument || standalone.contentWindow.document,
  }
}

export const Standalone = FC<StandaloneProps>(({ namespace, children }) => {
  useMountWithStandalone(() => {
    const { document } = getEnvironment(namespace)
    const root = document.createElement('div')
    const style = document.createElement('style')
    style.appendChild(document.createTextNode(defaultCss))
    createInstance(children as VNode).render(root)
    document.body.append(root)
    document.head.append(style)
  })
  return (
    <div class="h-full w-full">
      <iframe
        id={`container_${namespace}`}
        width="100%"
        height="100%"
        referrerPolicy="no-referrer"
        // @ts-ignore
        csp="default-src 'self'"
      ></iframe>
    </div>
  )
})
