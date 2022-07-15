import { Guidance } from '@/components/guidance'
import { ROUTE_MENUS, CORE_ROUTE_MENUS } from '@/pages'
import { useRouter, Link } from '@gyron/router'
import { resolve } from '@gyron/shared'
import { useMemo, defineProps, FC } from '@gyron/runtime'
import { ArrowLeftBoldIcon, ArrowRightBoldIcon } from './icons'
import { ContentMenu, MenuView } from '@/interface/menu'

export type ParentPath = 'docs' | 'core'

export interface MdxContainerProps {
  parentPath: ParentPath
  menu: ContentMenu
}

const RoutesMap: {
  [k in ParentPath]: MenuView[]
} = {
  docs: ROUTE_MENUS,
  core: CORE_ROUTE_MENUS,
}

export const MdxContainer = FC<MdxContainerProps>(() => {
  const router = useRouter()
  const props = defineProps<MdxContainerProps>()

  const state = useMemo(() => {
    const routes = RoutesMap[props.parentPath]
    const index = routes.findIndex(
      (item) => resolve(props.parentPath, item.path) === router.path
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

  return ({ children, menu }) => {
    return (
      <article class="relative z-20">
        <Guidance navigations={menu.anchor} />
        <div class="prose prose-slate mt-8 dark:prose-invert max-w-none">
          {children}
        </div>
        <footer class="text-sm leading-6 mt-12">
          <div class="mb-10 text-slate-700 font-semibold flex items-center dark:text-slate-200">
            {state.value.prev && (
              <Link
                to={state.value.prev.path}
                class="group flex items-center cursor-pointer hover:text-slate-900 dark:hover:text-white no-underline"
              >
                {<ArrowLeftBoldIcon />}
                {prevName.value}
              </Link>
            )}
            {state.value.next && (
              <Link
                to={state.value.next.path}
                class="group ml-auto flex items-center cursor-pointer hover:text-slate-900 dark:hover:text-white no-underline"
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
                  Produced with @gyron/docs
                </span>
              </p>
            </div>
            <a
              href={`https://github.com/Linkontoask/gyron/blob/master/packages/docs/src/app/source/${menu.meta.page}.mdx`}
              target="_blank"
              class="hover:text-slate-900 dark:hover:text-slate-400"
            >
              在 GitHub 上编辑此页
            </a>
          </div>
        </footer>
      </article>
    )
  }
})
