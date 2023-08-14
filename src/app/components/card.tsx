import { FC, VNode } from 'gyron'
import { CodeHighlight } from './highlight'
import { Link } from '@gyron/router'
import { $t } from '@/langs'
import classNames from 'classnames'

interface CardProps {
  title: VNode
  desc: string
  url: string
  codes: {
    type: 'tsx' | 'css'
    value: string
    name?: string
  }[]
}

export const CardCode = FC<CardProps>(({ title, desc, codes, url }) => {
  return (
    <section className="py-16">
      <h2 className="mt-4 text-xl sm:text-2xl dark:text-slate-100 font-extrabold tracking-tight text-slate-50">
        {title}
      </h2>
      <p className="mt-8 space-y-6">{desc}</p>
      <Link
        className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 focus:ring-sky-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500 my-8"
        to={url}
      >
        {$t('JSXText_27_7_29_6')}
      </Link>
      <div className="my-2">
        <CodeHighlight content={codes} />
      </div>
    </section>
  )
})

interface CardImageProps {
  src: string
  title: string
  desc: string
  url: string
  reversal?: boolean
}

export const CardImage = FC<CardImageProps>(
  ({ src, title, desc, url, reversal = false }) => {
    return (
      <section
        className={classNames(
          'my-24 flex h-96 rounded-xl shadow-xl ring-slate-900/5 overflow-auto',
          reversal ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <div className="w-1/2">
          <img className="h-full w-full object-cover" src={src} />
        </div>
        <div className="flex-1 px-6">
          <h2 className="mt-4 text-xl sm:text-2xl dark:text-slate-100 font-extrabold tracking-tight text-slate-50">
            {title}
          </h2>
          <p className="mt-8 space-y-6">{desc}</p>
          <a
            href={url}
            className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700 focus:ring-sky-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500 my-8"
            referrerPolicy="no-referrer"
            target="_blank"
          >
            {$t('JSXText_67_11_69_10')}
          </a>
        </div>
      </section>
    )
  }
)
