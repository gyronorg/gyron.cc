import { Link } from '@gyron/router'
import { FC } from 'gyron'

export const Mismatch = FC(() => {
  return (
    <div class="flex flex-auto items-center justify-center text-center px-4 flex-col sm:flex-row h-[calc(100vh-58px)]">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight sm:pr-6 sm:mr-6 sm:border-r sm:border-slate-900/10 sm:dark:border-slate-300/10 dark:text-slate-200">
        404
      </h1>
      <h2 class="mt-2 text-lg text-slate-700 dark:text-slate-400 sm:mt-0">
        走丢了吗？
        <Link to="/" replace className="underline">
          点我回到主页
        </Link>
      </h2>
    </div>
  )
})
