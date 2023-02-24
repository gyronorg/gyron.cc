import {
  Computed,
  createRef,
  FC,
  onAfterMount,
  Primitive,
  useValue,
  useWatch,
} from 'gyron'
import { debounce } from 'lodash-es'
import { OnAdd, Source } from './wrapper'
import type { IRange } from 'monaco-editor'
import { initialEditor } from './hook'

export type SourceType = 'typescript' | 'less'

interface EditorProps {
  namespace: string
  source: Computed<Source>
  sources: Source[]
  active?: Primitive<string>
  onChange: (code: string) => void
  onAdd?: OnAdd
  onRemove?: (uuid: string) => string
  onChangeActive?: (active: string, range?: IRange) => void
}

export const Editor = FC<EditorProps>(
  ({
    isSSR,
    namespace,
    sources,
    source,
    active,
    onChange,
    onAdd,
    onChangeActive,
  }) => {
    const container = createRef<HTMLDivElement & { __editor__: any }>()
    const loading = useValue(true)
    const owner = 'Link'

    let instance, editor, monaco
    useWatch(() => {
      if (!isSSR) {
        if (instance) {
          const url = `file:///${namespace}/${source.value.name}`
          const uri = monaco.Uri.parse(url)
          const model = editor.getModel(uri)
          instance.setModel(
            model ||
              editor.getModel(monaco.Uri.parse(`file:///${source.value.name}`))
          )
        }
      }
    }, [() => source.value])

    onAfterMount(async () => {
      if (!isSSR) {
        loading.value = true
        const { type, code, name, editContent } = source.value
        const codeEditor = await initialEditor({
          container: container.current,
          language: type,
          namespace,
          sources,
          code,
          name,
          editContent,
          onAdd,
          onChangeActive,
        })
        instance = codeEditor.instance
        editor = codeEditor.editor
        monaco = codeEditor.monaco
        container.current.__editor__ = Object.assign({}, codeEditor, {
          sources,
          namespace,
          onAdd,
          onChangeActive,
        })
        loading.value = false

        const model = instance.getModel()
        const onCodeChange = debounce(() => {
          const value = model.getValue()
          onChange(value)
        }, 200)
        model.onDidChangeContent(onCodeChange)

        editor.setModelMarkers(model, owner, [])
      }
    })

    return (
      <div class="h-full relative">
        {loading.value && (
          <div class="absolute left-0 top-0 w-full h-full text-white flex items-center justify-center">
            资源加载中...
          </div>
        )}
        <div
          class="h-full bg-[#1e293b] dark:bg-[#00000080]"
          ref={container}
        ></div>
      </div>
    )
  }
)
