import { FC, onAfterMount, useMemo, useValue } from 'gyron'
import { Link, useRouter } from '@gyron/router'
import { DarkToggle } from '@/components/dark'
import { CloseIcon, GithubIcon, LogoIcon, MenuIcon } from '@/components/icons'
import { Nav } from './nav'
import {
  DOCS_NAV,
  CORE_NAV,
  BLOG_NAV,
  CORE_NAV_EN,
  BLOG_NAV_EN,
  DOCS_NAV_EN,
} from '@/pages'
import { isUesLightTheme } from '@/hooks/light'
import { Lang, TogglerTranslate } from './translate'
import { $t, resolveTranslate } from '@/langs'
import pkg from '../../../package.json'
import classnames from 'classnames'
import docsearch from '@docsearch/js'
import '@docsearch/css'

const Portal = FC(({ children, isSSR }) => {
  if (!isSSR) {
    onAfterMount((component) => {
      if (component.vnode.el) {
        document.body.appendChild(component.vnode.el)
      }
    })
  }
  return children
})

export const Header = FC<{ lang: Lang }>(({ lang }) => {
  const router = useRouter()
  const expand = useValue(false)
  const menus = useMemo(() => {
    const path = router.path
    if (path.startsWith('/en-US')) {
      return path.startsWith('/en-US/core')
        ? CORE_NAV_EN
        : path.startsWith('/en-US/blog')
        ? BLOG_NAV_EN
        : DOCS_NAV_EN
    }
    return path.startsWith('/core')
      ? CORE_NAV
      : path.startsWith('/blog')
      ? BLOG_NAV
      : DOCS_NAV
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
    docsearch({
      container: '#docsearch',
      appId: '8M4INMGM9P',
      indexName: 'gyron',
      apiKey: 'e33f7babfe95749aae99870e61e9b7a1',
    })
  })

  return (
    <header
      class={classnames(
        'sticky top-0 z-50 h-[58px] backdrop-blur py-4 w-full px-4 md:px-8 transition-colors duration-500 lg:z-50 bg-opacity-60 dark:bg-slate-900/75'
      )}
    >
      <div
        class={classnames(
          'lg:m-auto lg:max-w-[86rem] pb-4',
          'border-b border-solid border-gray-300/30 dark:border-gray-700 lg:border-b lg:border-slate-300/20 dark:border-slate-50/[0.06]',
          'flex items-center justify-between sm-down:max-w-none dark:text-slate-200',
          {
            'text-slate-200': isUesLightTheme(router.path),
            'border-none': ['/', '/en-US', '/explorer', '/en-US/explorer'].includes(router.path),
          }
        )}
      >
        <Link
          to={resolveTranslate('/', lang)}
          activeClassName="nav-active-link"
          className={classnames(
            'hidden md:block overflow-hidden w-0 h-0 md:w-auto md:h-auto items-center',
            {
              'text-primary-400 dark:text-slate-200': !isUesLightTheme(
                router.path
              ),
            }
          )}
        >
          <span class="flex items-center">
            <LogoIcon />
            <span class="ml-3 text-sm">Gyron.js</span>
            <span class="ml-3 text-xs">v{pkg.version}</span>
          </span>
        </Link>
        <div class="md:hidden">
          <MenuIcon
            class={classnames({
              hidden: router.path === '/',
            })}
            expand={onToggleExpand}
          />
          <Portal>
            <span>
              <div
                class={classnames(
                  'fixed inset-0 z-50 bg-black/20 backdrop-blur-sm bg-opacity-60 dark:bg-slate-900/80 w-0 h-[100vh] opacity-0 transition-opacity',
                  {
                    'w-[100vw] opacity-100': expand.value,
                  }
                )}
                aria-hidden="true"
              ></div>
              <div
                class={classnames(
                  'fixed inset-0 z-50 lg:hidden transition-all w-0 translate-x-0 h-[calc(100vh-env(safe-area-inset-bottom))]',
                  {
                    'w-[100vw]': expand.value,
                  }
                )}
                aria-modal="true"
                role="dialog"
                onClick={onToggleExpand}
              >
                <div
                  class={classnames(
                    'relative bg-white w-80 max-w-[calc(100%-3rem)] dark:bg-slate-800 h-full overflow-y-auto transition-all pt-10',
                    {
                      'p-6': expand.value,
                    }
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    class="absolute right-6 w-6 h-6 flex items-center justify-center"
                    onClick={onToggleExpand}
                  >
                    <CloseIcon class="w-2.5 h-2.5" />
                  </div>
                  <Nav menus={menus.value} changed={onToggleExpand} />
                </div>
              </div>
            </span>
          </Portal>
        </div>
        <nav
          class={classnames('flex flex-none', {
            'text-slate-200': router.path === '/',
          })}
        >
          <ul class="font-bold text-sm md:text-base flex sm-down:space-y-6 space-x-5 md:space-x-6 items-center">
            <li>
              <Link
                to={resolveTranslate('/docs/tutorial', lang)}
                activeClassName="nav-active-link"
              >
                {$t('JSXText_151_74_153_14', lang)}
              </Link>
            </li>
            <li>
              <Link
                to={resolveTranslate('/core', lang)}
                activeClassName="nav-active-link"
              >
                {$t('JSXText_156_65_158_14', lang)}
              </Link>
            </li>
            <li>
              <Link
                to={resolveTranslate('/blog/readme', lang)}
                activeClassName="nav-active-link"
              >
                {$t('JSXText_161_72_163_14', lang)}
              </Link>
            </li>
            <li>
              <Link
                to={resolveTranslate('/explorer', lang)}
                activeClassName="nav-active-link"
              >
                {$t('JSXText_166_69_168_14', lang)}
              </Link>
            </li>
          </ul>
          <div class="flex items-center border-l border-slate-200 ml-3 md:ml-6 pl-3 md:pl-6 dark:border-slate-800 space-x-5 md:space-x-6">
            <DarkToggle />
            <a
              href="https://github.com/gyronorg/core"
              target="_blank"
              title={$t('JSXAttribute_176_14_176_26', lang)}
            >
              <span class="hidden">Github</span>
              <GithubIcon />
            </a>
            <TogglerTranslate />
          </div>
          <div
            class={classnames('w-15 sm:w-[199px] doc-light-search', {
              'doc-home-search': isUesLightTheme(router.path),
            })}
          >
            <div
              id="docsearch"
              class="pointer-events-auto border-l border-slate-200 dark:border-slate-800 ml-3 md:ml-6 pl-3 md:pl-6"
            ></div>
          </div>
        </nav>
      </div>
    </header>
  )
})
