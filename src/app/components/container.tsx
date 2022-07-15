import { Outlet } from '@gyron/router'
import { FC } from '@gyron/runtime'
import { Menu } from '@/interface/menu'
import { Nav } from './nav'
import classnames from 'classnames'
import '@docsearch/css'

interface PageLayoutProps {
  menu: Menu
}

export const DocsContainer = FC<PageLayoutProps>(() => {
  return ({ menu }) => {
    return (
      <div class="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
        <div class="hidden lg:block fixed z-20 inset-0 top-[3.8125rem] left-[max(0px,calc(50%-45rem))] right-auto w-[15.5rem] pb-10 px-8 overflow-y-auto">
          <Nav menus={menu} />
        </div>
        <div class="lg:pl-[16.5rem]">
          <main
            class={classnames(
              'max-w-3xl mx-auto xl:max-w-none xl:ml-0 xl:mr-[12.5rem]',
              {
                'xl:pr-16': true,
                'xl:mr-[15.5rem]': true,
              }
            )}
          >
            <Outlet />
          </main>
        </div>
      </div>
    )
  }
})
