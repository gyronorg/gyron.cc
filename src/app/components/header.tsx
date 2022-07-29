import { FC, onAfterMount, useMemo, useValue } from 'gyron'
import { Link, useRouter } from '@gyron/router'
import { DarkToggle } from '@/components/dark'
import { CloseIcon, GithubIcon, LogoIcon, MenuIcon } from '@/components/icons'
import { Nav } from './nav'
import { DOCS_NAV, CORE_NAV } from '@/pages'
import classnames from 'classnames'
// import docsearch from '@docsearch/js'

export const Header = FC(() => {
  const router = useRouter()
  const expand = useValue(false)
  const menus = useMemo(() => {
    return router.path.startsWith('/core') ? CORE_NAV : DOCS_NAV
  })

  function onToggleExpand() {
    expand.value = !expand.value
    if (expand.value) {
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.removeAttribute('style')
    }
  }

  onAfterMount(() => {
    // docsearch({
    //   container: '#docsearch',
    //   appId: '21FTFZSM25',
    //   indexName: 'search',
    //   apiKey: '34fb54ad8b121149927deeec2a1641f1',
    // })
  })

  return (
    <header class="sticky top-0 z-30 h-[58px] border-b border-solid border-gray-200 backdrop-blur dark:border-gray-700 py-4 w-full px-4 md:px-8 transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-opacity-60 supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75">
      <div
        class={classnames(
          'container mr-auto ml-auto flex items-center justify-between sm-down:max-w-none dark:text-slate-200',
          {
            'text-slate-200': router.path === '/',
          }
        )}
      >
        <Link
          to="/"
          activeClassName="nav-active-link"
          className={classnames(
            'hidden md:block overflow-hidden w-0 h-0 md:w-auto md:h-auto items-center',
            {
              'text-primary-400 dark:text-slate-200': router.path !== '/',
            }
          )}
        >
          <span class="flex">
            <LogoIcon />
            <span class="ml-3 text-sm">Gyron</span>
          </span>
        </Link>
        <div class="md:hidden">
          <MenuIcon
            class={classnames({
              hidden: router.path === '/',
            })}
            expand={onToggleExpand}
          />
          <div
            class={classnames(
              'absolute inset-0 z-50 lg:hidden transition-all w-0 translate-x-0 h-[calc(100vh-env(safe-area-inset-bottom))]',
              {
                'w-[100vw]': expand.value,
              }
            )}
            aria-modal="true"
            role="dialog"
          >
            <div
              class="fixed inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80 h-full"
              aria-hidden="true"
              onClick={onToggleExpand}
            ></div>
            <div
              class={classnames(
                'relative bg-white w-80 max-w-[calc(100%-3rem)] dark:bg-slate-800 h-full overflow-y-auto transition-all pt-10',
                {
                  'p-6': expand.value,
                }
              )}
            >
              <div
                class="absolute right-6 w-6 h-6 flex items-center justify-center"
                onClick={onToggleExpand}
              >
                <CloseIcon />
              </div>
              <Nav menus={menus.value} changed={onToggleExpand} />
            </div>
          </div>
        </div>
        <nav
          class={classnames('flex flex-none', {
            'text-slate-200': router.path === '/',
          })}
        >
          <ul class="font-bold text-sm md:text-base flex sm-down:space-y-6 space-x-5 md:space-x-6 items-center">
            <li>
              <Link to="/docs/tutorial" activeClassName="nav-active-link">
                文档
              </Link>
            </li>
            <li>
              <Link to="/core" activeClassName="nav-active-link">
                核心
              </Link>
            </li>
          </ul>
          <div class="flex items-center border-l border-slate-200 ml-5 md:ml-6 pl-5 md:pl-6 dark:border-slate-800 space-x-5 md:space-x-6">
            <DarkToggle />
            <a href="https://github.com/gyronorg/core" target="_blank">
              <span class="hidden">Github</span>
              <GithubIcon />
            </a>
          </div>
          {/* <div
            class={classnames('w-14 sm:w-[199px] doc-light-search', {
              'doc-home-search': router.path === '/',
            })}
          >
            <div
              id="docsearch"
              class="pointer-events-auto border-l border-slate-200 dark:border-slate-800 ml-5 md:ml-6 pl-5 md:pl-6"
            ></div>
          </div> */}
        </nav>
      </div>
    </header>
  )
})
