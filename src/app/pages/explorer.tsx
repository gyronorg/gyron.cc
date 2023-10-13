import { FC } from 'gyron'
import { Source, WrapperEditor } from '@/components/explorer/wrapper'
import { DescriptionWithMeta } from '@/components/description'
import { generateSafeUuid } from '@/utils/uuid'
import { $t } from '@/langs'
import sourceTSX from '@/demo/main/index.tsx.txt'
import sourceLESS from '@/demo/main/index.less.txt'
import classNames from 'classnames'

export const defaultSources: Source[] = [
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

interface ExplorerProps {
  sources?: Source[]
  hasPadding?: boolean
  height?: number
}

export const Explorer = FC<ExplorerProps>(
  ({ sources: _sources, height, hasPadding = true }) => {
    const sources = _sources && _sources.length ? _sources : defaultSources
    const namespace = generateSafeUuid()

    return (
      <div
        class={classNames('h-[calc(100vh-58px)]', {
          'p-4 pt-10': hasPadding,
        })}
        style={{ height: height + 'px' }}
      >
        <WrapperEditor sources={sources} namespace={namespace} />
      </div>
    )
  }
)
