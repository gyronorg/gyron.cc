import type { editor } from 'monaco-editor/esm/vs/editor/editor.api'

// jsx invalid
export async function initialMonacoJSX(
  monaco: any,
  monacoEditor: editor.IStandaloneCodeEditor
) {
  const {
    default: { default: traverse },
  } = await import('@babel/traverse')
  const {
    default: { parse },
  } = await import('@babel/parser')
  const { default: MonacoJSXHighlighter, JSXTypes } = await import(
    'monaco-jsx-highlighter'
  )

  const monacoJSXHighlighter = new MonacoJSXHighlighter(
    monaco, // references Range and other APIs
    parse, // obtains an AST, internally passes to parse options: {...options, sourceType: "module",plugins: ["jsx"],errorRecovery: true}
    traverse, // helps collecting the JSX expressions within the AST
    monacoEditor // highlights the content of that editor via decorations
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
  await import(
    'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution'
  )
  return await import('monaco-editor/esm/vs/editor/editor.api')
}
