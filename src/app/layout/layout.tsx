import { FC } from 'gyron'
import { useRouter } from '@gyron/router'
import { Header } from '@/components/header'
import { isUesLightTheme } from '@/hooks/light'
import classnames from 'classnames'

export const Layout = FC(({ children }) => {
  const router = useRouter()
  return (
    <div
      class={classnames(
        'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900',
        {
          'background-linear': true,
          'background-linear-full': isUesLightTheme(router.path),
        }
      )}
    >
      <Header />
      <div class="flex flex-col min-h-screen lg:m-auto lg:max-w-[90rem]">
        <div class={classnames('overflow-hidden')}>{children}</div>
      </div>
    </div>
  )
})
