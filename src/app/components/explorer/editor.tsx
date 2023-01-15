import { createRef, FC, onAfterMount } from 'gyron'

interface EditorProps {
  code: string
  onChange: (code: string) => void
}

export const Editor = FC<EditorProps>(({ isSSR, code, onChange }) => {
  const container = createRef<HTMLDivElement>()
  onAfterMount(() => {
    if (!isSSR) {
      import(
        'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution'
      ).then(() => {
        import('monaco-editor/esm/vs/editor/editor.api').then(({ editor }) => {
          const editorInstance = editor.create(container.current, {
            language: 'typescript',
            value: code,
            minimap: { enabled: false },
            lineNumbers: 'off',
          })
          const model = editorInstance.getModel()
          model.onDidChangeContent(() => {
            const value = model.getValue()
            onChange(value)
          })
        })
      })
    }
  })
  return <div class="h-[400px]" ref={container}></div>
})
