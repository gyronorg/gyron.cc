import { generateSafeUuid } from '@/utils/uuid'
import { createRef, FC, useComputed, useValue, useWatch } from 'gyron'
import { debounce } from 'lodash-es'
import { Explorer, MAIN_FILE } from './constant'
import { Editor, SourceType } from './editor'
import { getModal } from './hook'
import { Preview, PreviewExpose } from './preview'
import { Tabs, Tab } from './container'

export type OnAdd = (
  type: SourceType,
  name?: string,
  code?: string,
  editTitle?: boolean,
  editContent?: boolean,
  remove?: boolean,
  extra?: any
) => Source

export interface Source {
  code: string
  name: string
  label: string
  type: SourceType
  editTitle: boolean
  editContent: boolean
  remove: boolean
  uuid?: string
  extra?: any
}

let _uid = 1
const sourceName: Record<SourceType, string> = {
  typescript: 'Comp',
  less: 'Style',
}
const sourceSuffixName: Record<SourceType, string> = {
  typescript: '.tsx',
  less: '.less',
}

function normalizedSource(sources: Source[]): Source[] {
  return sources.map((item) => {
    return {
      ...item,
      uuid: generateSafeUuid(),
    }
  })
}

export interface WrapperEditorProps {
  sources?: Source[]
  namespace?: string
  onUpdateSources?: (e: Source[]) => void
}

export const WrapperEditor = FC<WrapperEditorProps>(
  ({ sources: _sources, namespace, onUpdateSources }) => {
    namespace ??= generateSafeUuid()

    const preview = createRef<PreviewExpose>()

    const sourcesDefault = _sources
      ? normalizedSource(_sources)
      : [
          {
            name: MAIN_FILE,
            label: MAIN_FILE,
            type: 'typescript',
            code: '',
            uuid: generateSafeUuid(),
            editTitle: false,
            editContent: true,
            remove: false,
          },
        ]
    const sources = useValue<Source[]>(sourcesDefault as Source[])
    const activeId = useValue<string>(sourcesDefault[0]?.uuid || '')
    const activeSource = useComputed(() =>
      sources.value.find((item) => item.uuid === activeId.value)
    )

    function onActiveChange(uuid: string, name: string) {
      sources.value.forEach((item) => {
        if (item.uuid === uuid) {
          item.label = item.name = name
        }
      })
    }

    const onRun = debounce((source: Source) => {
      if (preview && preview.current) {
        preview.current.start(source)
      }
    }, 3000)

    useWatch(() => {
      onUpdateSources?.(sources.value)
    })

    return (
      <Tabs
        namespace={namespace}
        active={activeId.value}
        sources={sources.value}
        onInputChange={onActiveChange}
        onAdd={onAdd}
        onRemove={onRemove}
        onChangeActive={onChangeActive}
        content={
          <Editor
            namespace={namespace}
            source={activeSource}
            active={activeId}
            sources={sources.value}
            onChange={(value, uuid) => {
              const source = sources.value.find((item) => item.uuid === uuid)
              source.code = value
              onRun(source)
            }}
            onChangeActive={onChangeActive}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        }
        preview={
          <Preview source={sources.value} namespace={namespace} ref={preview} />
        }
      >
        {sources.value.map((item) => (
          <Tab source={item}></Tab>
        ))}
        <Tab
          source={{
            name: Explorer.Preview,
            label: '预览',
            uuid: Explorer.Preview,
            editContent: false,
            editTitle: false,
            remove: false,
            code: '',
            type: 'less',
          }}
        ></Tab>
      </Tabs>
    )

    function onAdd(
      type: SourceType,
      name = '',
      code = '',
      editTitle = true,
      editContent = true,
      remove = true,
      extra: {}
    ) {
      const _name =
        name || `${sourceName[type]}${_uid++}${sourceSuffixName[type]}`
      const source = {
        code: code,
        name: _name,
        label: _name,
        type: type,
        editTitle: editTitle,
        editContent: editContent,
        remove: remove,
        extra: extra,
        uuid: generateSafeUuid(),
      }
      sources.value.push(source)
      return source
    }

    function onRemove(uuid: string) {
      const index = sources.value.findIndex((source) => source.uuid === uuid)
      const source = sources.value.find((source) => source.uuid === uuid)
      if (source) {
        getModal(source.name, namespace).then(({ model }) => {
          if (model) {
            model.dispose()
          }
        })
      }
      const nextIndex = index === 0 ? 1 : index - 1
      const nextUuid = sources.value[nextIndex]?.uuid
      activeId.value = nextUuid
      sources.value.splice(index, 1)
      return nextUuid
    }

    function onChangeActive(uuid: string) {
      activeId.value = uuid
    }
  }
)
