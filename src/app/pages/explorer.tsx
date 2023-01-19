import { FC } from 'gyron'
import { Source, WrapperEditor } from '@/components/explorer/wrapper'
import { decode } from 'js-base64'
import sourceTSX from '@/demo/main/index.tsx.txt'
import sourceLESS from '@/demo/main/index.less.txt'

export const Explorer = FC(() => {
  let sources: Source[] = [
    {
      code: sourceTSX,
      type: 'typescript',
      name: 'index.tsx',
    },
    {
      code: sourceLESS,
      type: 'less',
      name: 'index.less',
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
