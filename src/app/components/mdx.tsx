import { Guidance } from '@/components/guidance'
import {
  ROUTE_MENUS,
  CORE_ROUTE_MENUS,
  BLOG_ROUTE_MENUS,
  ROUTE_MENUS_EN,
  CORE_ROUTE_MENUS_EN,
  BLOG_ROUTE_MENUS_EN,
} from '@/pages'
import { useRouter, Link } from '@gyron/router'
import { resolve } from '@gyron/shared'
import { useMemo, defineProps, FC } from 'gyron'
import { ArrowLeftBoldIcon, ArrowRightBoldIcon } from './icons'
import { ContentMenu, MenuView } from '@/interface/menu'
import { $t } from '@/langs'
import { Lang } from './translate'

export type ParentPath =
  | 'docs'
  | 'core'
  | 'blog'
  | 'en-US/docs'
  | 'en-US/core'
  | 'en-US/blog'

export interface MdxContainerProps {
  parentPath: ParentPath
  menu: ContentMenu
  lang: Lang
}

const RoutesMap: {
  [k in ParentPath]: MenuView[]
} = {
  docs: ROUTE_MENUS,
  core: CORE_ROUTE_MENUS,
  blog: BLOG_ROUTE_MENUS,
  'en-US/docs': ROUTE_MENUS_EN,
  'en-US/core': CORE_ROUTE_MENUS_EN,
  'en-US/blog': BLOG_ROUTE_MENUS_EN,
}

export const MdxContainer = FC<MdxContainerProps>(
  ({ children, menu, lang, parentPath }) => {
    const router = useRouter()

    const state = useMemo(() => {
      const routes = RoutesMap[parentPath]
      const index = routes.findIndex(
        (item) => resolve(parentPath, item.path) === router.path
      )
      if (index >= 0) {
        const prev = routes[index - 1]
        const next = routes[index + 1]
        return {
          prev: prev,
          next: next,
        }
      }
      return {
        prev: null,
        next: null,
      }
    })

    const prevName = useMemo(() => {
      if (state.value.prev && state.value.prev?.meta?.group) {
        return `${state.value.prev.name}(${state.value.prev.meta.group})`
      }
      return state.value.prev.name
    })
    const nextName = useMemo(() => {
      if (state.value.next && state.value.next?.meta?.group) {
        return `${state.value.next.name}(${state.value.next.meta.group})`
      }
      return state.value.next.name
    })

    return (
      <article
        class="relative z-20"
        itemScope
        itemType="http://schema.org/Article"
      >
        <span
          hidden
          itemScope
          itemProp="author"
          itemType="http://schema.org/Person"
        >
          <meta itemProp="name" content="Link" />
          <meta itemProp="url" content="https://github.com/Linkontoask" />
        </span>
        <meta itemProp="image" content="/assets/image/logo-sm.png" />
        <Guidance navigation={menu.anchor} />
        <div class="prose prose-slate mt-8 dark:prose-invert max-w-none">
          {children}
        </div>
        <footer class="text-sm leading-6 mt-12">
          <div class="mb-10 text-slate-700 font-semibold flex items-center dark:text-slate-200">
            {state.value.prev && (
              <Link
                to={state.value.prev.path}
                className="group flex items-center cursor-pointer hover:text-slate-900 dark:hover:text-white no-underline"
              >
                {<ArrowLeftBoldIcon />}
                {prevName.value}
              </Link>
            )}

            {state.value.next && (
              <Link
                to={state.value.next.path}
                className="group ml-auto flex items-center cursor-pointer hover:text-slate-900 dark:hover:text-white no-underline"
              >
                {nextName.value}
                {<ArrowRightBoldIcon />}
              </Link>
            )}
          </div>
          <div class="pt-10 pb-28 border-t border-slate-200 sm:flex justify-between text-slate-500 dark:border-slate-200/5">
            <div class="mb-6 sm:mb-0 sm:flex">
              <p>
                <span>Copyright © {new Date().getFullYear()} Link</span>
                <span class="border-l border-slate-400 ml-4 pl-4">
                  Produced with
                  <a href="https://github.com/gyronorg/docs" class="underline">
                    @gyron/docs
                  </a>
                </span>
              </p>
            </div>
            <a
              href={`https://github.com/gyronorg/docs/tree/master/src/app/source/${lang}/${menu.meta.page}.mdx`}
              target="_blank"
              class="hover:text-slate-900 dark:hover:text-slate-400"
            >
              {$t('JSXText_133_13_135_12')}
            </a>
          </div>
        </footer>
      </article>
    )
  }
)
