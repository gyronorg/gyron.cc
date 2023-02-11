import { storeState } from '@/store'
import { createRef, FC, nextRender, onAfterMount, useReactive } from 'gyron'
import { omit } from '@gyron/shared'
import { Link } from '@gyron/router'
import { AnchorIcon, CopyIcon } from './icons'
import classnames from 'classnames'

export const A = FC<{ href: string }>(({ href, children }) => {
  if (/(\/\/|@)/.test(href)) {
    return (
      <a href={href} target="_blank">
        {children}
      </a>
    )
  }
  if (/#/.test(href)) {
    return <a href={href}>{children}</a>
  }
  return <Link to={href}>{children}</Link>
})

export const P = FC(({ children }) => {
  return <p itemProp="description">{children}</p>
})

export const H1 = FC(({ children }) => {
  return (
    <h1
      class="inline-block text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200"
      itemProp="headline name"
    >
      {children}
    </h1>
  )
})

export const H2 = FC(({ children }) => {
  const ref = createRef<HTMLElement>()

  onAfterMount(() => {
    nextRender(() => {
      if (ref.current) {
        const { id, offsetTop } = ref.current
        storeState.guidance[offsetTop] = id
      }
    })
  })

  return (
    <h2
      itemProp="headline name"
      class="group flex items-center whitespace-pre-wrap -ml-4 pl-4 relative guidance"
      id={children[0]}
      ref={ref}
    >
      <a
        href={`#${children[0]}`}
        class="absolute -ml-10 flex items-center opacity-0 border-0 group-hover:opacity-100"
      >
        <div class="cursor-pointer w-6 h-6 text-slate-400 ring-1 ring-slate-900/5 rounded-md shadow-sm flex items-center justify-center hover:ring-slate-900/10 hover:shadow hover:text-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:shadow-none dark:ring-0">
          {<AnchorIcon />}
        </div>
      </a>
      <span>{children}</span>
    </h2>
  )
})

export const H3 = FC(({ children }) => {
  const ref = createRef<HTMLElement>()

  onAfterMount(() => {
    nextRender(() => {
      if (ref.current) {
        const { id, offsetTop } = ref.current
        storeState.guidance[offsetTop] = id
      }
    })
  })

  return (
    <h3
      class="group flex items-center whitespace-pre-wrap -ml-4 pl-4 relative guidance"
      id={children[0]}
      ref={ref}
    >
      <a
        href={`#${children[0]}`}
        class="absolute -ml-10 flex items-center opacity-0 border-0 group-hover:opacity-100"
      >
        <div class="cursor-pointer w-6 h-6 text-slate-400 ring-1 ring-slate-900/5 rounded-md shadow-sm flex items-center justify-center hover:ring-slate-900/10 hover:shadow hover:text-slate-700 dark:bg-slate-700 dark:text-slate-300 dark:shadow-none dark:ring-0">
          {<AnchorIcon />}
        </div>
      </a>
      <span>{children}</span>
    </h3>
  )
})

const Pre = FC(({ children }) => {
  const code = children[0]

  let meta = code.props?.meta,
    timer = null

  if (meta) {
    meta = JSON.parse(meta)
    code.props = omit(code.props, 'meta')
  }

  const copyState = useReactive({
    status: true,
    copying: false,
    mouse: false,
  })

  const copy = () => {
    const content = meta?.content
    try {
      copyState.copying = true
      if (content) {
        navigator.clipboard.writeText(content)
        copyState.status = true
      } else {
        copyState.status = false
      }
    } catch (e) {
      copyState.status = false
    } finally {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        copyState.copying = false
        timer = null
      }, 2000)
    }
  }

  return (
    <div
      class={classnames('relative group', {
        'mt-12': Boolean(meta?.filename),
      })}
    >
      {meta && meta.filename && (
        <span class="absolute -top-[24px] bg-[#1e293b] dark:bg-[#00000080] text-white text-xs px-2 pb-2 pt-1 rounded rounded-bl-none">
          {meta.filename}
        </span>
      )}
      <div
        aria-label="Copy"
        class={classnames(
          'w-4 h-4 text-slate-100 absolute right-5 top-4 cursor-pointer opacity-20 group-hover:opacity-100 transition-opacity select-none'
        )}
        onClick={copy}
        onMouseleave={() => (copyState.copying = false)}
        onMousedown={() => (copyState.mouse = true)}
        onMouseup={() => (copyState.mouse = false)}
      >
        <CopyIcon
          class={classnames({
            'translate-y-[1px] translate-x-[1px]': copyState.mouse,
          })}
        />
        <div
          class={classnames(
            'opacity-0 bg-neutral-800 text-neutral-100 w-16 text-xs p-1 text-center left-1/2 -translate-x-1/2 absolute mt-2 rounded',
            {
              'opacity-100': copyState.copying,
            }
          )}
        >
          {copyState.copying
            ? copyState.status
              ? '拷贝成功'
              : '拷贝失败'
            : ''}
        </div>
      </div>
      <pre>{code}</pre>
    </div>
  )
})

interface ImageProps {
  alt: string
  src: string
}

const Image = FC<ImageProps>(({ alt, src }) => {
  return <img src={src} alt={alt} />
})

export const MdxHelper = {
  a: A,
  p: P,
  h1: H1,
  h2: H2,
  h3: H3,
  pre: Pre,
  img: Image,
}
