import { initialMonaco } from '@/hooks/monaco'
import { generateSafeUuid } from '@/utils/uuid'
import { createRef, FC, nextRender, useValue } from 'gyron'
import type { IRange } from 'monaco-editor'
import { Explorer, MAIN_FILE } from './constant'
import { Editor, EditorType } from './editor'
import { useEditor, useEditorResolve } from './hook'
import { Preview, PreviewExpose } from './preview'
import { Tabs, Tab } from './tab'

export type OnAdd = (
  type: EditorType,
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
  type: EditorType
  editTitle: boolean
  editContent: boolean
  remove: boolean
  uuid?: string
  extra?: any
}

let _uid = 1
const sourceName: Record<EditorType, string> = {
  typescript: 'Comp',
  less: 'Style',
}
const sourceSuffixName: Record<EditorType, string> = {
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
    const active = useValue(null)

    const preview = createRef<PreviewExpose>()

    const sourcesDefault = _sources
      ? normalizedSource(_sources)
      : [
          {
            name: MAIN_FILE,
            type: 'typescript',
            code: '',
            uuid: generateSafeUuid(),
            editTitle: false,
            editContent: true,
            remove: false,
          } as const,
        ]
    const sources = useValue<Source[]>(sourcesDefault)

    function onActiveChange(uuid: string, name: string) {
      sources.value.forEach((item) => {
        if (item.uuid === uuid) {
          item.name = name
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
          const model = monaco.Uri.parse(`file:///${source.name}`)
          const t = monaco.editor.getModel(model)
          t && t.dispose()
          monaco.editor.createModel(source.code, source.type, model)
        })
      })

    return (
      <Tabs
        namespace={namespace}
        active={active.value}
        onInputChange={onActiveChange}
        onAdd={add}
        onRemove={onRemove}
        onRun={onRun}
        onChangeActive={onChangeActive}
      >
        {sources.value.map((item) => (
          <Tab
            name={item.name}
            label={item.name}
            uuid={item.uuid}
            editTitle={item.editTitle}
            editContent={item.editContent}
            remove={item.remove}
          >
            <Editor
              key={item.uuid}
              name={item.name}
              code={item.code}
              type={item.type}
              editTitle={item.editTitle}
              editContent={item.editContent}
              active={active.value}
              sources={sources.value}
              onChange={(value) => (item.code = value)}
              onChangeActive={onChangeActive}
              onAdd={add}
              onRemove={onRemove}
            />
          </Tab>
        ))}
        <Tab
          name={Explorer.Preview}
          label="预览"
          fixed="right"
          uuid={Explorer.Preview}
          editTitle={false}
          editContent={false}
          remove={false}
        >
          <Preview source={sources.value} namespace={namespace} ref={preview} />
        </Tab>
      </Tabs>
    )

    function add(
      type: EditorType,
      name = '',
      code = '',
      editTitle = true,
      editContent = true,
      remove = true,
      extra: {}
    ) {
      const source = {
        code: code,
        name: name || `${sourceName[type]}${_uid++}${sourceSuffixName[type]}`,
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
      sources.value.splice(index, 1)
      return nextUuid
    }

    function onChangeActive(v: string, range?: IRange) {
      active.value = v
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
