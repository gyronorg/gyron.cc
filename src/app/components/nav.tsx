import { Menu } from '@/interface/menu'
import { useRouter, useHref, useRoute } from '@gyron/router'
import { defineProps, FC } from 'gyron'
import classnames from 'classnames'

interface DocsLinkProps {
  menus: Menu
  changed?: () => void
}

export const Nav = FC<DocsLinkProps>(({ menus }) => {
  const router = useRouter()
  const route = useRoute()
  const props = defineProps<DocsLinkProps>()

  const active = (path: string) => {
    return route.value.path === path
  }

  function onClick(e: Event, path: string) {
    e.preventDefault()
    router.push(useHref(path)).then(props.changed)
  }

  return (
    <aside>
      <div class="text-sm mt-3 hidden">
        <div>当前版本</div>
        <div>v0.0.10-alpha.2</div>
      </div>
      <nav class="lg:text-sm lg:leading-6">
        <ul class="space-y-12 lg:space-y-8 md:first:mt-12 lg:first:mt-8">
          {menus.map((group) => (
            <li>
              <h5 class="mb-8 lg:mb-3 font-semibold text-slate-900 dark:text-slate-200">
                {group.name}
              </h5>
              <ul class="space-y-6 lg:space-y-2 border-l border-slate-100 dark:border-slate-800">
                {group.children.map((menu) => (
                  <li>
                    <a
                      href={useHref(menu.path)}
                      class={classnames(
                        'block border-l pl-4 -ml-px hover:text-sky-600 dark:hover:border-slate-600 dark:text-slate-400 text-slate-700 dark:hover:text-slate-300',
                        {
                          'router-active-link': active(menu.path),
                          'border-current': active(menu.path),
                          'border-transparent': !active(menu.path),
                          'dark:text-slate-400': !active(menu.path),
                          'dark:text-sky-400': active(menu.path),
                          'dark:hover:text-sky-400': active(menu.path),
                          'dark:hover:border-sky-400': active(menu.path),
                        }
                      )}
                      onClick={(e) => onClick(e, menu.path)}
                    >
                      {menu.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
})
