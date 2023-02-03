import { FC } from 'gyron'
import { Source, WrapperEditor } from '@/components/explorer/wrapper'
import { decode } from 'js-base64'
import sourceTSX from '@/demo/main/index.tsx.txt'
import sourceLESS from '@/demo/main/index.less.txt'
import classNames from 'classnames'

interface ExplorerProps {
  sources?: Source[]
  hasPadding?: boolean
  height?: number
}

export const Explorer = FC<ExplorerProps>(
  ({ sources: _sources, height, hasPadding = true }) => {
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
      <div
        class={classNames('h-[calc(100vh-58px)]', {
          'p-4': hasPadding,
        })}
        style={{ height: height + 'px' }}
      >
        <WrapperEditor sources={sources} />
      </div>
    )
  }
)
