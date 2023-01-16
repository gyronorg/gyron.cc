import { FC, onAfterMount } from 'gyron'
import { transform, visitor } from '@gyron/babel-plugin-jsx'
import { Source } from './wrapper'
import { v4 as uuid } from 'uuid'

interface PreviewProps {
  source: Source[]
}

function generateHelper(code: string, id: string) {
  return `import { createInstance } from 'https://unpkg.com/gyron/dist/browser/index.js'
  
  ${code}
  
  createInstance(<APP />).render(document.getElementById('${id}'))`
}

function startEditorRuntime(
  code: string,
  id: string,
  localMap: Record<string, Source>
) {
  const old = document.querySelector('#standalone')
  if (old) {
    old.remove()
  }
  const script = document.createElement('script')
  script.setAttribute('type', 'module')
  const ret = transform(generateHelper(code, id), visitor, {
    setup: true,
    transformLocalImportHelper: (path) => {
      return localMap[path.node.source.value]?.code || ''
    },
    importSourceMap: {
      gyron: 'https://unpkg.com/gyron/dist/browser/index.js',
    },
  })
  script.id = 'standalone'
  script.innerHTML = ret.code
  document.body.append(script)
}

export const Preview = FC<PreviewProps>(({ source }) => {
  const id = uuid().replace(/-/g, '')

  onAfterMount(() => {
    const main = source[0]
    const map = source.slice(1).reduce<Record<string, Source>>((prev, curr) => {
      prev[curr.name] = curr
      return prev
    }, {})
    startEditorRuntime(main.code, id, map)
  })

  return <div class="h-[400px] bg-[#1e293b] dark:bg-[#00000080] p-4" id={id}></div>
})
