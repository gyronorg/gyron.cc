import { createRef, FC, onAfterMount } from 'gyron'

export const Editor = FC(({ isSSR }) => {
  const container = createRef<HTMLDivElement>()
  onAfterMount(() => {
    if (!isSSR) {
      import(
        'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution'
      ).then(() => {
        import('monaco-editor/esm/vs/editor/editor.api').then(({ editor }) => {
          editor.create(container.current, {
            language: 'typescript',
          })
        })
      })
    }
  })
  return <div class="h-[400px]" ref={container}></div>
})
