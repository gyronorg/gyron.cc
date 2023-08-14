import { FC, useMemo } from 'gyron'
import { ENIcon, ZHIcon } from './icons'
import { useRouter } from '@gyron/router'
import { Popover } from './popover'
import classNames from 'classnames'
import cookie from 'js-cookie'

export enum Lang {
  ZH = 'zh-CN',
  EN = 'en-US',
}

const langs = [
  {
    value: Lang.ZH,
    icon: ZHIcon,
    label: '中文',
  },
  {
    value: Lang.EN,
    icon: ENIcon,
    label: 'English',
  },
]

export interface TranslateProviderProps {
  lang: Lang
}

export const TogglerTranslate = FC(({ isSSR }) => {
  const router = useRouter()
  const lang = useMemo(() => {
    return router.path.startsWith('/en-US') ? Lang.EN : Lang.ZH
  })

  const handleChosesLang = (lang: Lang) => {
    document.documentElement.lang = lang
    cookie.set('lang', lang)
    if (lang === Lang.ZH) {
      location.href = router.path
        .replace(/^\/(zh-CN|en-US)/, '/')
        .replace(/\/\//g, '/')
    } else {
      location.href = `/${lang}${router.path}`.replace(/\/$/, '')
    }
  }

  return (
    <Popover
      content={
        <>
          {langs.map((item) => (
            <li
              onClick={() => handleChosesLang(item.value)}
              class={classNames(
                'py-2 px-2 flex items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600/30',
                {
                  'text-sky-500': item.value === lang.value && !isSSR,
                }
              )}
            >
              <item.icon />
              <span class="ml-2">{item.label}</span>
            </li>
          ))}
        </>
      }
    >
      {lang.value === Lang.ZH ? <ZHIcon /> : <ENIcon />}
    </Popover>
  )
})
