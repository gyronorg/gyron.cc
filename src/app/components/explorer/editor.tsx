import { useDark } from '@/hooks/dark'
import { initialMonaco, initialMonacoJSX } from '@/hooks/monaco'
import {
  createRef,
  FC,
  onAfterMount,
  Primitive,
  useEffect,
} from 'gyron'
import { debounce } from 'lodash-es'
import { CompilerError } from './wrapper'
import jsxDts from './jsx.d.ts.txt'
import gyronDts from './gyron.d.ts.txt'

export type EditorType = 'typescript' | 'less'

interface EditorProps {
  name: string
  code: string
  type: EditorType
  compilerTsxError: Primitive<CompilerError[]>
  onChange: (code: string) => void
}

const ThemeName = 'DOCS'

async function initialEditor(
  container: HTMLElement,
  code: string,
  language: EditorType,
  name: string
) {
  const monaco = await initialMonaco()
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
    jsxDts,
    'file:///node_modules/@types/jsx/index.d.ts'
  )

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    `declare module 'gyron' { ${gyronDts} }`,
    'file:///node_modules/@types/gyron/index.d.ts'
  )

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    `declare const Gyron`,
    'file:///node_modules/@types/GyronJSX/index.d.ts'
  )

  const ts = editor.getModel(monaco.Uri.parse(`file:///${name}`))
  if (ts) {
    ts.dispose()
  }

  editor.defineTheme(ThemeName, {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {},
  })
  const instance = editor.create(container, {
    model: editor.createModel(
      code,
      language,
      monaco.Uri.parse(`file:///${name}`)
    ),
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
  return {
    editor,
    monaco,
    instance,
  }
}

export const Editor = FC<EditorProps>(
  ({ isSSR, code, type, compilerTsxError, name, onChange }) => {
    const container = createRef<HTMLDivElement>()
    const isDark = useDark(isSSR)

    onAfterMount(async () => {
      if (!isSSR) {
        const { instance, editor } = await initialEditor(
          container.current,
          code,
          type,
          name
        )

        const model = instance.getModel()
        const onCodeChange = debounce(() => {
          const value = model.getValue()
          onChange(value)
        }, 200)
        model.onDidChangeContent(onCodeChange)

        useEffect(() => {
          const error = compilerTsxError.value.filter(
            (item) => item.parent === name
          )
          if (error.length) {
            editor.setModelMarkers(
              model,
              'Link',
              error.map((item) => {
                return {
                  severity: 8,
                  message: item.message,
                  startColumn: item.loc.start.column,
                  startLineNumber: item.loc.start.line - 5,
                  endColumn: item.loc.end.column,
                  endLineNumber: item.loc.end.line - 5,
                }
              })
            )
          } else {
            editor.removeAllMarkers('Link')
          }
        })
      }
    })

    return (
      <div
        class="h-full bg-[#1e293b] dark:bg-[#00000080]"
        ref={container}
      ></div>
    )
  }
)
