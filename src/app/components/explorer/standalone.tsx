import { FC, VNode, createInstance, nextRender, onAfterMount } from 'gyron'
import { EVENT_TYPES, useEvent } from '@/hooks/event'
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
    window: standalone?.contentWindow,
    document:
      standalone?.contentDocument || standalone?.contentWindow?.document,
  }
}

export const Standalone = FC<StandaloneProps>(
  ({ namespace, children, isSSR }) => {
    let doc: Document
    useEvent(EVENT_TYPES.dark, (dark: boolean) => {
      doc.documentElement.className = ''
      doc.documentElement.classList.add(dark ? 'dark' : 'light')
    })
    useMountWithStandalone(() => {
      const { document } = getEnvironment(namespace)
      if (document) {
        const name =
          window.localStorage.getItem('theme') ||
          (window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light')
        const style = document.createElement('style')
        style.appendChild(document.createTextNode(defaultCss))
        createInstance(children as VNode).render(document.body)
        document.documentElement.classList.add(name)
        document.head.append(style)
        doc = document
      }
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
          allowTransparency
        ></iframe>
      </div>
    )
  }
)
