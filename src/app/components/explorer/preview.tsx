import {
  createRef,
  exposeComponent,
  FC,
  onAfterMount,
  onDestroyed,
  useValue,
} from 'gyron'
import { initialBabelBundle } from '@gyron/babel-plugin-jsx'
import { Source } from './wrapper'
import { generateSafeUuid } from '@/utils/uuid'
import { Loading } from '../icons/animation'
import { isInViewport, useElementMutationObserver } from '@/utils/dom'
import { useStandaloneNamespace } from './tab'
import { SourceType } from './editor'
import type { NodePath } from '@babel/core'
import type { ImportDeclaration } from '@babel/types'
import type { BuildResult } from 'esbuild-wasm'
import classNames from 'classnames'
import less from 'less'

export interface PreviewExpose {
  start: () => void
}

export type TransformInValidate = (
  ret?: {
    name: string
    type: SourceType
  }[]
) => void

interface PreviewProps {
  source: Source[]
  namespace: string
}

function removeStandalone(namespace: string, cls: string) {
  const clsElement = document.getElementsByClassName(cls)
  new Array(...clsElement).forEach((item) => item.remove())
}

function initialRuntime(namespace: string) {
  removeStandalone(namespace, `script_${namespace}`)
  removeStandalone(namespace, `style_${namespace}`)
}

function insertScript(ret: BuildResult, namespace: string) {
  const name = `script_${namespace}`
  const script = document.createElement('script')
  script.setAttribute('type', 'module')
  script.id = 'standalone'
  script.async = true
  script.innerHTML = ret.outputFiles[0].text
  script.className = name
  document.body.append(script)
}

let build: (main: any, config: any) => Promise<BuildResult<any>>
async function startEditorRuntime(
  main: Source,
  containerId: string,
  sources: Source[],
  namespace: string
) {
  !build && (build = await initialBabelBundle('/assets/esbuild.wasm'))

  sources = sources.map((item) => ({
    ...item,
    loader: item.type === 'less' ? 'css' : 'tsx',
  }))

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i]
    if (source.type === 'less') {
      const css = (await less.render(`.${namespace}{${source.code}}`)).css
      source.code = `var style = document.createElement('style')
      style.id = '${source.uuid}'
      style.className = 'style_${namespace}'
      style.setAttribute('type', 'text/css')
      style.setAttribute('data-name', '${source.name}')
      style.appendChild(document.createTextNode(${JSON.stringify(css)}))
      document.head.append(style)`
      source.type = 'typescript'
      source.name = source.name + '.ts'
    }
  }

  const code = `import { APP } from './${main.name}';
import { createInstance } from 'gyron'
const _helperCallback = window['$${namespace}']
window.addEventListener('error', e => _helperCallback && _helperCallback(e.error))

try {
  createInstance(<APP />).render(document.getElementById('${containerId}'))
  _helperCallback && _helperCallback()
} catch(e) {
  _helperCallback && _helperCallback(e)
}`

  const ret = await build(
    {
      code: code,
      name: '_app.tsx',
      loader: 'tsx',
      rootFileName: '_app.tsx',
      setup: true,
      importSourceMap: {
        gyron: location.origin + '/assets/gyron/index.js',
      },
      external: [],
    },
    {
      sources: sources,
    }
  )

  if (ret.warnings.length) {
  }

  initialRuntime(namespace)
  insertScript(ret, namespace)
}

export const Preview = FC<PreviewProps>(({ source, namespace, isSSR }) => {
  const loading = useValue(false)
  const id = generateSafeUuid()
  const container = createRef<Element>()

  !isSSR &&
    useElementMutationObserver(container, () => {
      loading.value = false
    })

  function start() {
    container.current.innerHTML = ''
    loading.value = true
    const main = source[0]

    return startEditorRuntime(main, id, source, namespace)
  }

  let started = false
  function onScroll() {
    if (isInViewport(container.current) && !started) {
      started = true
      start().then(() => {
        document.removeEventListener('scroll', onScroll)
      })
    }
  }

  exposeComponent({
    start: start,
  })

  onAfterMount(() => {
    if (isInViewport(container.current)) {
      onScroll()
    } else {
      document.addEventListener('scroll', onScroll, {
        passive: true,
      })
    }
  })

  onDestroyed(() => {
    removeStandalone(namespace, `script_${namespace}`)
    removeStandalone(namespace, `style_${namespace}`)
    document.removeEventListener('scroll', onScroll)
  })

  return (
    <div class="h-full bg-gray-200 dark:bg-[#1e293b] p-4">
      {loading.value && (
        <div class="h-full flex items-center justify-center">
          <Loading class="w-8" />
        </div>
      )}
      <div
        class={classNames(
          'h-full overflow-auto text-slate-800 dark:text-slate-100',
          namespace
        )}
        id={id}
        ref={container}
      ></div>
    </div>
  )
})
