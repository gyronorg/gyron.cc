import { createRef, exposeComponent, FC, onAfterMount, useValue } from 'gyron'
import { transform, visitor } from '@gyron/babel-plugin-jsx'
import { Source } from './wrapper'
import { generateSafeUuid } from '@/utils/uuid'
import { Loading } from '../icons/animation'
import { useElementMutationObserver } from '@/utils/dom'

export interface PreviewExpose {
  start: () => void
}

interface PreviewProps {
  source: Source[]
  namespace: string
}

function generateHelper(code: string, id: string) {
  return `import { createInstance } from 'https://unpkg.com/gyron/dist/browser/index.js'
  
  ${code}
  
  createInstance(<APP />).render(document.getElementById('${id}'))`
}

function insertScript(ret: any, namespace: string) {
  const name = `script_${namespace}`
  const scripts = document.getElementsByClassName(name)
  new Array(...scripts).forEach((item) => item.remove())

  const script = document.createElement('script')
  script.setAttribute('type', 'module')
  script.id = 'standalone'
  script.innerHTML = ret.code
  script.className = name
  document.body.append(script)
}

function insertStyle(cssResource: Source[], namespace: string) {
  const name = `style_${namespace}`
  const css = document.getElementsByClassName(name)
  new Array(...css).forEach((item) => item.remove())

  if (cssResource.length) {
    cssResource.forEach((css) => {
      const style = document.createElement('style')
      style.id = css.uuid
      style.type = 'text/css'
      style.className = name
      style.setAttribute('data-name', css.name)
      style.appendChild(document.createTextNode(css.code))
      document.head.append(style)
    })
  }
}

function startEditorRuntime(
  code: string,
  containerId: string,
  fileMap: Record<string, Source>,
  namespace: string
) {
  const cssResource: Source[] = []
  const ret = transform(generateHelper(code, containerId), visitor, {
    setup: true,
    transformLocalImportHelper: (path) => {
      const source = path.node.source.value.replace(/^\.\//, '')
      const ret = fileMap[source]
      if (source.endsWith('.css')) {
        if (ret.code === null) {
          // TODO
        }
        cssResource.push(ret)
        return {
          shouldTransform: false,
          code: null,
        }
      }
      return {
        shouldTransform: path.node.source.value.endsWith('.jsx'),
        code: ret.code,
      }
    },
    importSourceMap: {
      gyron: 'https://unpkg.com/gyron/dist/browser/index.js',
    },
  })

  insertStyle(cssResource, namespace)
  insertScript(ret, namespace)
}

export const Preview = FC<PreviewProps>(({ source, namespace }) => {
  const loading = useValue(false)
  const id = generateSafeUuid()
  const container = createRef<Element>()

  useElementMutationObserver(container, () => {
    loading.value = false
  })

  function start() {
    container.current.innerHTML = ''
    loading.value = true
    const main = source[0]
    const map = source.slice(1).reduce<Record<string, Source>>((prev, curr) => {
      prev[curr.name] = curr
      return prev
    }, {})
    startEditorRuntime(main.code, id, map, namespace)
  }

  exposeComponent({
    start: start,
  })

  return (
    <div class="h-full bg-[#1e293b] dark:bg-[#00000080] p-4">
      {loading.value && (
        <div class="h-full flex items-center justify-center">
          <Loading class="w-8" />
        </div>
      )}
      <div class="h-full" id={id} ref={container}></div>
    </div>
  )
})
