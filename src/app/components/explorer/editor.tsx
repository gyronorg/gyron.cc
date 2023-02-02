import { createRef, FC, onAfterMount, useValue } from 'gyron'
import { debounce } from 'lodash-es'
import { OnAdd, Source } from './wrapper'
import type { IRange } from 'monaco-editor'
import { initialEditor } from './hook'

export type EditorType = 'typescript' | 'less'

interface EditorProps {
  name: string
  code: string
  type: EditorType
  sources: Source[]
  editTitle: boolean
  editContent: boolean
  active?: string
  onChange: (code: string) => void
  onAdd?: OnAdd
  onRemove?: (uuid: string) => string
  onChangeActive?: (active: string, range?: IRange) => void
}

export const Editor = FC<EditorProps>(
  ({
    isSSR,
    code,
    type,
    name,
    sources,
    editContent,
    onChange,
    onAdd,
    onChangeActive,
  }) => {
    const container = createRef<HTMLDivElement>()
    const loading = useValue(true)
    const owner = 'Link'

    onAfterMount(async () => {
      if (!isSSR) {
        loading.value = true
        const { instance, editor } = await initialEditor({
          container: container.current,
          language: type,
          code,
          name,
          sources,
          editContent,
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
