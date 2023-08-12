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
    value: string
    name?: string
  }[]
}

export const CodeHighlight = FC<EditorWindowProps>(({ content }) => {
  return (
    <div class="container max-w-3xl prose prose-slate dark:prose-invert">
      {content.map((item) => {
        return (
          <pre className="bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 prism-light relative">
            {item.name && <div class="absolute right-4 text-gray-400">{item.name}</div>}
            <code
              className={`language-${item.type}`}
              html={toHtml(refractor.highlight(item.value, item.type))}
            ></code>
          </pre>
        )
      })}
    </div>
  )
})
