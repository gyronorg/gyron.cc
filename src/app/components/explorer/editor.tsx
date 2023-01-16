import { useDark } from '@/hooks/dark'
import { initialMonaco, initialMonacoJSX } from '@/hooks/monaco'
import { createRef, FC, onAfterMount } from 'gyron'

export type EditorType = 'jsx' | 'css'

interface EditorProps {
  code: string
  type: EditorType
  onChange: (code: string) => void
}

const ThemeName = 'DOCS'

async function initialEditor(container: HTMLElement, code: string) {
  const monaco = await initialMonaco()
  const { editor } = monaco
  editor.defineTheme(ThemeName, {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {},
  })
  const instance = editor.create(container, {
    language: 'typescript',
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
  const jsxInstance = await initialMonacoJSX(monaco, instance)
  return {
    editor,
    instance,
    jsxInstance,
  }
}

export const Editor = FC<EditorProps>(({ isSSR, code, onChange }) => {
  const container = createRef<HTMLDivElement>()
  const isDark = useDark(isSSR)
  onAfterMount(async () => {
    if (!isSSR) {
      const { instance, editor } = await initialEditor(container.current, code)
      const model = instance.getModel()
      model.onDidChangeContent(() => {
        const value = model.getValue()
        onChange(value)
      })
    }
  })
  return (
    <div class="h-full bg-[#1e293b] dark:bg-[#00000080]" ref={container}></div>
  )
})
