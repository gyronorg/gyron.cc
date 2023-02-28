import {
  createRef,
  exposeComponent,
  FC,
  Instance,
  onAfterMount,
  onDestroyed,
  useValue,
} from 'gyron'
import { initialBabelBundle } from '@gyron/babel-plugin-jsx'
import { Source } from './wrapper'
import { generateSafeUuid } from '@/utils/uuid'
import { Loading } from '../icons/animation'
import { isInViewport, useElementMutationObserver } from '@/utils/dom'
import { SourceType } from './editor'
import type { BuildResult } from 'esbuild-wasm'
import classNames from 'classnames'
import less from 'less'
import { keys } from 'lodash-es'

export interface PreviewExpose {
  start: (source: Source) => void
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
  namespace: string,
  instanceInner: string
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
window.addEventListener('error', e => _helperCallback && _helperCallback.runtime(e.error))

try {
  window['${instanceInner}'] = createInstance(<APP />).render(document.getElementById('${containerId}'))
  _helperCallback && _helperCallback.runtime()
} catch(e) {
  _helperCallback && _helperCallback.runtime(e)
}`

  const _helperCallback = window[`$${namespace}`]

  // 清除编译时的错误
  _helperCallback && _helperCallback.building()

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
      options: {
        metafile: true,
      },
    }
  ).catch((e) => {
    _helperCallback && _helperCallback.building(e)
  })

  if (ret) {
    if (_helperCallback) {
      if (ret.warnings.length) {
        _helperCallback.building(
          new Error(ret.warnings.map((item) => item.text).join('\n'))
        )
      } else {
        _helperCallback.building()
      }
    }

    initialRuntime(namespace)
    insertScript(ret, namespace)
  }

  return ret && ret.metafile
}

export const Preview = FC<PreviewProps>(({ source, namespace, isSSR }) => {
  const loading = useValue(false)
  const id = generateSafeUuid()
  const container = createRef<Element>()
  let metafile: BuildResult['metafile']
  let app: string

  !isSSR &&
    useElementMutationObserver(container, () => {
      loading.value = false
    })

  async function start(_source?: Source) {
    let shouldRestart = true
    if (_source && metafile) {
      const hit = keys(metafile.inputs).find(
        (item) =>
          item.replace('localModule:./', '').replace(/\.(tsx|ts)/, '') ===
          _source.name.replace(/\.(tsx|ts)/, '')
      )
      shouldRestart = Boolean(hit)
    }
    if (shouldRestart) {
      window[app] && window[app].destroy()
      loading.value = true
      try {
        app = generateSafeUuid('instance')
        metafile = await startEditorRuntime(
          source[0],
          id,
          source,
          namespace,
          app
        )
      } finally {
        loading.value = false
      }
    }
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
