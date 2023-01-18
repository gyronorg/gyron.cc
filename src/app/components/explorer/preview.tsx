import {
  createRef,
  exposeComponent,
  FC,
  onAfterMount,
  onDestroyed,
  useValue,
} from 'gyron'
import { transform, visitor } from '@gyron/babel-plugin-jsx'
import { Source } from './wrapper'
import { generateSafeUuid } from '@/utils/uuid'
import { Loading } from '../icons/animation'
import { useElementMutationObserver } from '@/utils/dom'
import { useStandaloneNamespace } from './tab'
import { EditorType } from './editor'
import type { NodePath } from '@babel/core'
import type { ImportDeclaration } from '@babel/types'

export interface PreviewExpose {
  start: () => void
}

export type TransformInValidate = (ret: {
  name: string
  parent: string
  type: EditorType
  path: NodePath<ImportDeclaration>
}) => void

interface PreviewProps {
  source: Source[]
  namespace: string
  onTransformInValidate: TransformInValidate
}

// TODO
// 所有ast中的节点都需要把起始行数按照如下规则进行更新
function generateHelper(code: string, id: string, namespace: string) {
  return `import { createInstance } from 'https://unpkg.com/gyron/dist/browser/index.js'
  
  const _helperCallback = window['$${namespace}']
  window.addEventListener('error', e => _helperCallback && _helperCallback(e.error))

  ${code}
  
  try {
    createInstance(<APP />).render(document.getElementById('${id}'))
    _helperCallback && _helperCallback()
  } catch(e) {
    _helperCallback && _helperCallback(e)
  }
`
}

function removeStandalone(namespace: string, cls: string) {
  const clsElement = document.getElementsByClassName(cls)
  new Array(...clsElement).forEach((item) => item.remove())
}

function insertScript(ret: any, namespace: string) {
  const name = `script_${namespace}`
  removeStandalone(namespace, name)

  const script = document.createElement('script')
  script.setAttribute('type', 'module')
  script.id = 'standalone'
  script.async = true
  script.innerHTML = ret.code
  script.className = name
  document.body.append(script)
}

function insertStyle(cssResource: Source[], namespace: string) {
  const name = `style_${namespace}`
  removeStandalone(namespace, name)

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
  namespace: string,
  onTransformInValidate: PreviewProps['onTransformInValidate']
) {
  const cssResource: Source[] = []
  const ret = transform(generateHelper(code, containerId, namespace), visitor, {
    setup: true,
    root: 'Comp.tsx',
    transformLocalImportHelper: (path, parent) => {
      const source = path.node.source.value.replace(/^\.\//, '')
      const ret = fileMap[source]
      if (!ret) {
        onTransformInValidate({
          name: source,
          path: path,
          parent: parent.replace(/^\.\//, ''),
          type: source.endsWith('.css') ? 'css' : 'typescript',
        })
        return {
          shouldTransform: false,
          code: null,
        }
      }
      if (source.endsWith('.css')) {
        if (ret) {
          cssResource.push(ret)
        }
        return {
          shouldTransform: false,
          code: null,
        }
      }
      return {
        shouldTransform: path.node.source.value.endsWith('.tsx'),
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

export const Preview = FC<PreviewProps>(
  ({ source, namespace, isSSR, onTransformInValidate }) => {
    const loading = useValue(false)
    const id = generateSafeUuid()
    const container = createRef<Element>()

    const wrapperError = !isSSR && useStandaloneNamespace(namespace)

    !isSSR &&
      useElementMutationObserver(container, () => {
        loading.value = false
      })

    function start() {
      container.current.innerHTML = ''
      loading.value = true
      const main = source[0]
      const map = source
        .slice(1)
        .reduce<Record<string, Source>>((prev, curr) => {
          prev[curr.name] = curr
          return prev
        }, {})
      startEditorRuntime(main.code, id, map, namespace, onTransformInValidate)
    }

    exposeComponent({
      start: start,
    })

    onDestroyed(() => {
      removeStandalone(namespace, `script_${namespace}`)
      removeStandalone(namespace, `style_${namespace}`)
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
  }
)
