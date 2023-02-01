import { FC } from 'gyron'
import { Source, WrapperEditor } from '@/components/explorer/wrapper'
import { decode } from 'js-base64'
import sourceTSX from '@/demo/main/index.tsx.txt'
import sourceLESS from '@/demo/main/index.less.txt'

interface ExplorerProps {
  sources?: Source[]
}

export const Explorer = FC<ExplorerProps>(({ sources: _sources }) => {
  let sources: Source[] = _sources || [
    {
      code: sourceTSX,
      type: 'typescript',
      name: 'index.tsx',
      editTitle: false,
      editContent: true,
      remove: false,
    },
    {
      code: sourceLESS,
      type: 'less',
      name: 'index.less',
      editTitle: true,
      editContent: true,
      remove: true,
    },
  ]

  try {
    sources = JSON.parse(
      decode(new URLSearchParams(location.search).get('sources'))
    )
  } catch {}

  return (
    <div class="p-4 h-[calc(100vh-58px)]">
      <WrapperEditor sources={sources} />
    </div>
  )
})
