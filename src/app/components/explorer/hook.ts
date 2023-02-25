import { initialMonaco, initialService, initialMonacoJSX } from '@/hooks/monaco'
import type { editor, IRange } from 'monaco-editor'
import { SourceType } from './editor'
import { OnAdd, Source } from './wrapper'
import generateDTS from '@/www'
import { isDarkTheme } from '../dark'

interface InitialEditor {
  namespace: string
  container: HTMLElement
  code: string
  language: SourceType
  name: string
  editContent: boolean
  sources: Source[]
  onAdd: OnAdd
  onChangeActive: (active: string, range?: IRange) => void
}

let initialed = false
async function _initialEditor({
  namespace,
  container,
  code,
  language,
  name,
  editContent,
}: InitialEditor) {
  const monaco = await initialMonaco()
  const service = await initialService()
  const dts = await generateDTS()
  const scheme = 'file'
  const uri = monaco.Uri.parse(`${scheme}:///${namespace}/${name}`)

  const { editor } = monaco

  if (!initialed) {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'Gyron',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
    })

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    })

    const jsx = dts['jsx.d.ts']
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      jsx.text,
      monaco.Uri.parse(jsx.name).toString()
    )

    const gyron = dts['gyron.d.ts']
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      gyron.text,
      monaco.Uri.parse(gyron.name).toString()
    )

    const csstype = dts['csstype.d.ts']
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      csstype.text,
      monaco.Uri.parse(csstype.name).toString()
    )

    editor.defineTheme('vs-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {},
    })
  }

  const instance = editor.create(container, {
    model: editor.getModel(uri) || editor.createModel(code, language, uri),
    readOnly: !editContent,
    language: language,
    theme: isDarkTheme() ? 'vs-dark' : 'vs-light',
    minimap: { enabled: false },
    selectOnLineNumbers: false,
    scrollBeyondLastLine: false,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    codeLens: false,
    renderLineHighlight: 'none',
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 10,
    tabSize: 2,
    lineNumbersMinChars: 3,
    quickSuggestions: true,
    fontSize: 14,
    automaticLayout: true,
    padding: {
      top: 10,
      bottom: 10,
    },
    scrollbar: {
      horizontalScrollbarSize: 8,
      verticalScrollbarSize: 8,
      useShadows: false,
    },
  })
  if (language === 'typescript') {
    await initialMonacoJSX(monaco, instance)
  }

  if (!initialed) {
    initialed = true

    for (const key in dts) {
      const { name, text } = dts[key]
      const { model, uri } = await getModal(name)
      if (!model) {
        editor.createModel(text, 'typescript', uri)
      }
    }

    interface Input {
      resource: {
        path: string
        scheme: string
      }
      options: {
        selection: IRange
        selectionRevealType: number
        selectionSource: string
      }
    }
    const editorService = {
      openCodeEditor: async (input: Input, _: editor.IStandaloneCodeEditor) => {
        const range = _.getPosition()
        const { resource, options } = input
        const { startColumn, endColumn } = _.getModel().getWordAtPosition(range)
        const selection = Object.assign(options.selection, {
          endColumn: options.selection.startColumn + endColumn - startColumn,
        })

        const { model } = await getModal(resource.path.slice(1))
        _.setModel(model)

        const { instance, namespace, sources, onAdd, onChangeActive } = (
          _ as any
        )._domElement.__editor__

        instance.revealLineInCenter(selection.startLineNumber, 0)
        instance.setSelection(selection)

        const path = resource.path.replace(`/${namespace}`, '')
        const source = sources.find((source) => {
          if (resource.scheme === scheme) {
            return source.name === path.slice(1)
          }
          return (
            dts[path]?.name === source.name || dts[source.name]?.origin === path
          )
        })
        if (source) {
          onChangeActive(source.uuid)
        } else {
          const { name, text } = dts[path.slice(1)]
          const source = onAdd('typescript', name, text, false, false)
          onChangeActive(source.uuid)
        }

        return _
      },
    }
    Object.assign(service, editorService)
  }

  return {
    editor,
    monaco,
    instance,
  }
}

export async function initialEditor(
  ...params: Parameters<typeof _initialEditor>
) {
  const { editor, monaco, instance } = await _initialEditor(...params)

  return {
    editor,
    monaco,
    instance,
  }
}

export async function getModal(name: string, namespace?: string) {
  const monaco = await initialMonaco()
  const url = namespace ? `file:///${namespace}/${name}` : `file:///${name}`
  const uri = monaco.Uri.parse(url)
  const model = monaco.editor.getModel(uri)
  return {
    uri,
    model,
  }
}

export async function getModals() {
  const monaco = await initialMonaco()
  const models = monaco.editor.getModels()
  return models
}

export interface Editor {
  instance: editor.IStandaloneCodeEditor
  monaco: typeof import('monaco-editor')
  editor: typeof editor
  sources: Source[]
  namespace: string
  onAdd: OnAdd
  onChangeActive: (active: string, range?: IRange) => void
}
export function getEditorWithElement(namespace: string) {
  const el = document.querySelector(`.editor-${namespace}`) as HTMLElement & {
    __editor__: Editor
  }
  return el.__editor__
}
