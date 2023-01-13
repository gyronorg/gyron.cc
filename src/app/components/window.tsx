import { FC } from 'gyron'
import { refractor } from 'refractor/lib/core.js'
import { toHtml } from 'hast-util-to-html'
import css from 'refractor/lang/css.js'
import tsx from 'refractor/lang/tsx'

refractor.register(css)
refractor.register(tsx)

export interface EditorWindowProps {
  content: {
    type: 'tsx' | 'css'
    name: string
    value: string
  }[]
}

export const EditorWindow = FC<EditorWindowProps>(({ content }) => {
  return (
    <div class="container mr-auto ml-auto max-w-3xl prose prose-slate dark:prose-invert">
      {content.map((item) => {
        return (
          <pre>
            <code
              html={toHtml(refractor.highlight(item.value, item.type))}
            ></code>
          </pre>
        )
      })}
    </div>
  )
})
