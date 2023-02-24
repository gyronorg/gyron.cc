import { initialMonaco, initialService, initialMonacoJSX } from '@/hooks/monaco'
import type { editor, IRange } from 'monaco-editor'
import { SourceType } from './editor'
import { OnAdd, Source } from './wrapper'
import generateDTS from '@/www'
import { last } from 'lodash-es'
import { nextRender } from 'gyron'

let _instance: editor.IStandaloneCodeEditor
let _resolve: Promise<any> = Promise.resolve()

const ThemeName = 'DOCS'

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

    editor.defineTheme(ThemeName, {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {},
    })
  }

  const instance = editor.create(container, {
    model: editor.getModel(uri) || editor.createModel(code, language, uri),
    readOnly: !editContent,
    language: language,
    theme: ThemeName,
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
      const url = `file:///${name}`
      const uri = monaco.Uri.parse(url)
      const ts = editor.getModel(uri)
      if (!ts) {
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
        const url = `${scheme}:///${resource.path.slice(1)}`
        const uri = monaco.Uri.parse(url)
        const model = editor.getModel(uri)
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
          nextRender(() => {
            instance.revealLineInCenter(selection.startLineNumber, 0)
            instance.setSelection(selection)
          })
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
  _resolve = _initialEditor(...params)
  const { editor, monaco, instance } = await _resolve

  _instance = instance

  return {
    editor,
    monaco,
    instance,
  }
}

export function useEditor() {
  return _instance
}

export function useEditorResolve() {
  return _resolve
}
