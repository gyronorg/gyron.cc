import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'

// jsx invalid
export async function initialMonacoJSX(
  monaco: any,
  monacoEditor: editor.IStandaloneCodeEditor
) {
  const {
    // @ts-ignore
    default: { default: traverse },
  } = await import('@babel/traverse')
  const {
    default: { parse },
  } = await import('@babel/parser')
  const { default: MonacoJSXHighlighter, JSXTypes } = await import(
    '@gyron/monaco-jsx-highlight'
  )

  const monacoJSXHighlighter = new MonacoJSXHighlighter(
    monaco,
    parse,
    traverse,
    monacoEditor
  )

  monacoJSXHighlighter.highlightOnDidChangeModelContent()
  monacoJSXHighlighter.addJSXCommentCommand()

  JSXTypes.JSXText.options.inlineClassName = 'token.plain-text'
  JSXTypes.JSXBracket.options.inlineClassName = 'token.punctuation'
  JSXTypes.JSXIdentifier.options.inlineClassName = 'token.tag'
  JSXTypes.JSXAttribute.options.inlineClassName = 'token.attr-name'

  return monacoJSXHighlighter
}

export async function initialMonaco() {
  window.MonacoEnvironment = {
    getWorkerUrl(_, label) {
      if (label === 'css' || label === 'less') {
        return '/assets/css.worker.js'
      }
      return '/assets/editor.worker.js'
    },
  }

  await import(
    'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution'
  )
  await import('monaco-editor/esm/vs/basic-languages/css/css.contribution')
  return await import('monaco-editor')
}

export async function initialService() {
  const { StandaloneServices } = await import(
    'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices'
  )
  const { ICodeEditorService } = await import(
    'monaco-editor/esm/vs/editor/browser/services/codeEditorService'
  )
  return StandaloneServices.get(ICodeEditorService)
}
