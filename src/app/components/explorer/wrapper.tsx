import { initialMonaco } from '@/hooks/monaco'
import { generateSafeUuid } from '@/utils/uuid'
import { createRef, FC, nextRender, useComputed, useValue } from 'gyron'
import type { IRange } from 'monaco-editor'
import { Explorer, MAIN_FILE } from './constant'
import { Editor, SourceType } from './editor'
import { useEditor, useEditorResolve } from './hook'
import { Preview, PreviewExpose } from './preview'
import { Tabs, Tab } from './tab'

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
}

export const WrapperEditor = FC<WrapperEditorProps>(
  ({ sources: _sources, isSSR }) => {
    const namespace = generateSafeUuid()
    

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
    const activeId = useValue<string>(sourcesDefault[0].uuid)
    const activeSource = useComputed(() => sources.value.find(item => item.uuid === activeId.value))

    function onActiveChange(uuid: string, name: string) {
      sources.value.forEach((item) => {
        if (item.uuid === uuid) {
          item.label = item.name = name
        }
      })
    }

    function onRun() {
      if (preview && preview.current) {
        preview.current.start()
      }
    }

    // 初始化时将所有 model 设置到内存中，给 ctrl + click 提供数据支撑
    !isSSR &&
      sources.value.slice(1).forEach((source) => {
        initialMonaco().then((monaco) => {
          const model = monaco.Uri.parse(`file:///${namespace}/${source.name}`)
          const t = monaco.editor.getModel(model)
          if (!t) {
            monaco.editor.createModel(source.code, source.type, model)
          }
        })
      })

    return (
      <Tabs
        namespace={namespace}
        active={activeId.value}
        onInputChange={onActiveChange}
        onAdd={onAdd}
        onRemove={onRemove}
        onRun={onRun}
        onChangeActive={onChangeActive}
        content={
          <Editor
            namespace={namespace}
            source={activeSource}
            active={activeId}
            sources={sources.value}
            onChange={(value) => (activeSource.value.code = value)}
            onChangeActive={onChangeActive}
            onAdd={onAdd}
            onRemove={onRemove}
          />
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
        >
          <Preview source={sources.value} namespace={namespace} ref={preview} />
        </Tab>
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
      const nextIndex = index === 0 ? 1 : index - 1
      const nextUuid = sources.value[nextIndex]?.uuid
      activeId.value = nextUuid
      sources.value.splice(index, 1)
      return nextUuid
    }

    function onChangeActive(v: string, range?: IRange) {
      activeId.value = v
      if (range) {
        nextRender(() =>
          useEditorResolve().then(() => {
            const instance = useEditor()
            if (instance) {
              instance.revealLineInCenter(range.startLineNumber, 0)
              instance.setSelection(range)
            }
          })
        )
      }
    }
  }
)
