import { FC } from 'gyron'
import { Source, WrapperEditor } from '@/components/explorer/wrapper'
import { decode } from 'js-base64'
import { DescriptionWithMeta } from '@/components/description'
import sourceTSX from '@/demo/main/index.tsx.txt'
import sourceLESS from '@/demo/main/index.less.txt'
import classNames from 'classnames'

interface ExplorerProps {
  sources?: Source[]
  hasPadding?: boolean
  height?: number
  namespace?: string
  onUpdateSources?: (e: Source[]) => void
}

export const Explorer = FC<ExplorerProps>(
  ({
    sources: _sources,
    height,
    namespace,
    onUpdateSources,
    hasPadding = true,
  }) => {
    let sources: Source[] =
      _sources && _sources.length
        ? _sources
        : [
            {
              code: sourceTSX,
              type: 'typescript',
              name: 'index.tsx',
              label: '',
              editTitle: false,
              editContent: true,
              remove: false,
            },
            {
              code: sourceLESS,
              type: 'less',
              name: 'index.less',
              label: '',
              editTitle: true,
              editContent: true,
              remove: true,
            },
          ]

    return (
      <div
        class={classNames('h-[calc(100vh-58px)]', {
          'p-4 pt-10': hasPadding,
        })}
        style={{ height: height + 'px' }}
      >
        <WrapperEditor
          sources={sources}
          onUpdateSources={onUpdateSources}
          namespace={namespace}
        />
        <DescriptionWithMeta desc="Gyron.js 的在线编辑器。 Gyron.js playground。 在这里可以直接编辑预览 Gyron.js 的项目" />
      </div>
    )
  }
)
