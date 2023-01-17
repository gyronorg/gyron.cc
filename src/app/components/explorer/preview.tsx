import { FC, onAfterMount } from 'gyron'
import { transform, visitor } from '@gyron/babel-plugin-jsx'
import { Source } from './wrapper'
import { generateSafeUuid } from '@/utils/uuid'

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
  const scripts = document.getElementsByClassName(namespace)
  new Array(...scripts).forEach((item) => item.remove())

  const script = document.createElement('script')
  script.setAttribute('type', 'module')
  script.id = 'standalone'
  script.innerHTML = ret.code
  script.className = namespace
  document.body.append(script)
}

function insertStyle(cssResource: Source[], namespace: string) {
  const css = document.getElementsByClassName(namespace)
  new Array(...css).forEach((item) => item.remove())

  if (cssResource.length) {
    cssResource.forEach((css) => {
      const style = document.createElement('style')
      style.innerHTML = css.code
      style.id = css.uuid
      style.setAttribute('data-name', css.name)
      style.className = namespace
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

  insertScript(ret, namespace)
  insertStyle(cssResource, namespace)
}

export const Preview = FC<PreviewProps>(({ source, namespace }) => {
  const id = generateSafeUuid()

  onAfterMount(() => {
    const main = source[0]
    const map = source.slice(1).reduce<Record<string, Source>>((prev, curr) => {
      prev[curr.name] = curr
      return prev
    }, {})
    startEditorRuntime(main.code, id, map, namespace)
  })

  return (
    <div class="h-[400px] bg-[#1e293b] dark:bg-[#00000080] p-4" id={id}></div>
  )
})
