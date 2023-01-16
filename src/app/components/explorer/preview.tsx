import { createRef, FC, onAfterMount } from 'gyron'
// @ts-ignore
import { transform, visitor } from '@gyron/babel-plugin-jsx'

interface PreviewProps {
  code: string
}

function startEditorRuntime(code: string, localMap: Record<string, string>) {
  const script = document.createElement('script')
  script.setAttribute('type', 'module')
  const ret = transform(code, visitor, {
    transformLocalImportHelper: (path) => {
      return localMap[path.node.source.value] || ''
    },
    importSourceMap: {
      gyron: 'https://unpkg.com/gyron/dist/browser/index.js',
    },
  })
  script.innerHTML = ret.code
  document.body.append(script)
}

export const Preview = FC<PreviewProps>(({ code }) => {
  const container = createRef<HTMLDivElement>()
  return <div class="h-[400px]" ref={container}></div>
})
