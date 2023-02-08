import { initialMonaco, initialService, initialMonacoJSX } from '@/hooks/monaco'
import type { editor, IRange } from 'monaco-editor'
import { SourceType } from './editor'
import { OnAdd, Source } from './wrapper'
import generateDTS from '@/www'

let _instance: editor.IStandaloneCodeEditor
let _resolve: Promise<any> = Promise.resolve()

const ThemeName = 'DOCS'

interface InitialEditor {
  container: HTMLElement
  code: string
  language: SourceType
  name: string
  editContent: boolean
  sources: Source[]
  onAdd: OnAdd
  onChangeActive: (active: string, range?: IRange) => void
}

async function _initialEditor({
  container,
  code,
  language,
  name,
  sources,
  editContent,
  onAdd,
  onChangeActive,
}: InitialEditor) {
  const monaco = await initialMonaco()
  const service = await initialService()
  const dts = await generateDTS()
  const scheme = 'file'
  const uri = monaco.Uri.parse(`${scheme}:///${name}`)

  const { editor } = monaco

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

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    dts.jsx.text,
    monaco.Uri.parse(dts.jsx.origin + dts.jsx.path).toString()
  )

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    dts.gyron.text,
    monaco.Uri.parse(dts.gyron.origin + dts.gyron.path).toString()
  )

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    dts.csstype.text,
    monaco.Uri.parse(dts.csstype.origin + dts.csstype.path).toString()
  )

  const ts = editor.getModel(uri)
  if (ts) {
    ts.dispose()
  }

  editor.defineTheme(ThemeName, {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {},
  })

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

      const source = sources.find((source) => {
        if (resource.scheme === scheme) {
          return source.name === resource.path.slice(1)
        }

        return (
          dts[resource.path]?.name === source.name ||
          dts[source.name]?.origin === resource.path
        )
      })
      if (source) {
        onChangeActive(source.uuid, selection)
      } else {
        const { name, text } = dts[resource.path]
        const source = onAdd('typescript', name, text, false, false)
        onChangeActive(source.uuid, selection)
      }
      return _
    },
  }

  const instance = editor.create(
    container,
    {
      model: editor.createModel(code, language, uri),
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
    },
    {
      codeEditorService: Object.assign(service, editorService),
    }
  )
  if (language === 'typescript') {
    await initialMonacoJSX(monaco, instance)
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
