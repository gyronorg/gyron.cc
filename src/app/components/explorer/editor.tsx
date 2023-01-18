import { useDark } from '@/hooks/dark'
import { initialMonaco, initialMonacoJSX } from '@/hooks/monaco'
import {
  createRef,
  FC,
  onAfterMount,
  Primitive,
  useEffect,
  useWatch,
} from 'gyron'
import { debounce } from 'lodash-es'
import { CompilerError } from './wrapper'
import jsx from './jsx.d.ts.txt'

export type EditorType = 'typescript' | 'css'

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
  language: 'typescript' | 'css'
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
    reactNamespace: 'React',
    allowJs: true,
    typeRoots: ['node_modules/@types'],
  })

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  })

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    jsx,
    `/assets/jsx.d.ts`
  )

  editor.defineTheme(ThemeName, {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {},
  })
  const instance = editor.create(container, {
    language: language,
    value: code,
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
          type
        )

        const model = instance.getModel()
        const onCodeChange = debounce(() => {
          const value = model.getValue()
          onChange(value)
        }, 200)
        model.onDidChangeContent(onCodeChange)

        useEffect(() => {
          if (name === 'Comp.tsx' && compilerTsxError.value.length) {
            editor.setModelMarkers(
              model,
              'Link',
              compilerTsxError.value.map((item) => {
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
