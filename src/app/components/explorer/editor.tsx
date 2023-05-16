import {
  Computed,
  createRef,
  exposeComponent,
  FC,
  onAfterMount,
  Primitive,
  useValue,
  useWatch,
} from 'gyron'
import { debounce } from 'lodash-es'
import { OnAdd, Source } from './wrapper'
import type { IRange } from 'monaco-editor'
import { getModal, initialEditor } from './hook'
import { EVENT_TYPES, useEvent } from '@/hooks/event'
import { isDarkTheme } from '../dark'
import classNames from 'classnames'

export type SourceType = 'typescript' | 'less'

interface EditorProps {
  namespace: string
  source: Computed<Source>
  sources: Source[]
  active?: Primitive<string>
  onChange: (code: string, id: string) => void
  onAdd?: OnAdd
  onRemove?: (uuid: string) => string
  onChangeActive?: (active: string, range?: IRange) => void
}

export const Editor = FC<EditorProps>(
  ({ isSSR, namespace, sources, source, onChange, onAdd, onChangeActive }) => {
    const container = createRef<HTMLDivElement & { __editor__: any }>()
    const loading = useValue(true)
    const isDark = useValue(isDarkTheme(isSSR))
    const owner = 'Link'

    let instance: any, editor: any, monaco: any, changeContentHandle
    const onChangeModel = debounce(async () => {
      if (!isSSR) {
        if (instance) {
          let { model } = await getModal(source.value.name, namespace)
          model ||= editor.getModel(
            monaco.Uri.parse(`file:///${source.value.name}`)
          )
          model.setValue(source.value.code)
          instance.setModel(model)

          const onCodeChange = () => {
            const value = model.getValue()
            onChange(value, source.value.uuid)
          }
          if (changeContentHandle) {
            changeContentHandle.dispose()
          }
          changeContentHandle = model.onDidChangeContent(onCodeChange)
        }
      }
    }, 100)
    useWatch(onChangeModel, [() => source.value])
    useEvent(EVENT_TYPES.dark, (_isDark) => {
      isDark.value = _isDark
      editor.setTheme(_isDark ? 'vs-dark' : 'vs')
    })

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
        const onCodeChange = () => {
          const value = model.getValue()
          onChange(value, source.value.uuid)
        }
        changeContentHandle = model.onDidChangeContent(onCodeChange)
      }
    })

    return (
      <div class="h-full relative">
        {loading.value && (
          <div class="absolute left-0 top-0 w-full h-full dark:text-white flex items-center justify-center">
            资源加载中...
          </div>
        )}
        <div
          class={classNames(
            'h-full bg-slate-100 dark:bg-[#1e293b]',
            `editor-${namespace}`,
            {
              'monaco-editor-light': !isDark.value,
            }
          )}
          ref={container}
        ></div>
      </div>
    )
  }
)
