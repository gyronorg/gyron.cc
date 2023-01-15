import { FC, useValue } from 'gyron'
import { DarkIcon, LightIcon, SystemIcon } from './icons'
import { onDestroyed } from 'gyron'
import { EVENT_TYPES, useEvent } from '@/hooks/event'
import classnames from 'classnames'

const themeIcons = {
  light: LightIcon,
  dark: DarkIcon,
  system: SystemIcon,
}

type Theme = string | keyof typeof themeIcons

function trigger(add?: boolean) {
  const theme = document.querySelector(
    'meta[name="theme-color"]'
  ) as HTMLMetaElement
  if (add) {
    document.documentElement.classList.add('dark')
    document.documentElement.setAttribute('data-theme', 'dark')
    theme.content = '#0f172a'
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.removeAttribute('data-theme')
    theme.content = '#f8fafc'
  }
}

export function isDarkTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const DarkToggle = FC(({ isSSR }) => {
  const theme = useValue<Theme>(
    (isSSR ? 'system' : localStorage.theme) || 'system'
  )
  const visible = useValue(false)

  const handlePopTheme = (e: Event) => {
    e.stopPropagation()
    visible.value = !visible.value
  }

  const event = useEvent(EVENT_TYPES.dark)

  const handleChosesTheme = (themeName: Theme) => {
    theme.value = themeName

    // 发送主题变更事件
    event.emit(themeName === 'dark')

    if (themeName === 'system') {
      const mediaDark = isDarkTheme()
      trigger()
      if (mediaDark) {
        trigger(true)
      }
      localStorage.removeItem('theme')
      document.cookie = 'theme=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    } else {
      localStorage.theme = themeName
      document.cookie = `theme=${themeName}; max-age=31536000`
      trigger()
      if (themeName === 'dark') {
        trigger(true)
      }
    }
  }

  if (!isSSR) {
    const mediaDark = window.matchMedia('(prefers-color-scheme: dark)')
    if (theme.value === 'system') {
      if (mediaDark.matches) {
        trigger(true)
      } else {
        trigger()
      }
      mediaDark.addEventListener('change', (e) => {
        const themeName = e.matches ? 'dark' : ''
        theme.value = theme.value === 'system' ? 'system' : themeName
        if (themeName === 'dark') {
          trigger(true)
        } else {
          trigger()
        }
      })
    } else {
      if (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) && mediaDark.matches)
      ) {
        trigger(true)
      } else {
        trigger()
      }
    }
    const changeVisible = () => {
      visible.value = false
    }
    window.addEventListener('click', changeVisible)
    onDestroyed(() => {
      window.removeEventListener('click', changeVisible)
    })
  }

  return () => {
    const mediaDark = isSSR
      ? { matches: false }
      : window.matchMedia('(prefers-color-scheme: dark)')
    const themes = Object.keys(themeIcons).map((name) => ({
      origin: name,
      name: name.slice(0, 1).toLocaleUpperCase() + name.slice(1),
      Icon: themeIcons[name],
    }))
    const ActiveIcon =
      theme.value === 'system'
        ? mediaDark.matches
          ? DarkIcon
          : LightIcon
        : themeIcons[theme.value]

    return (
      <div class="relative select-none" onClick={handlePopTheme}>
        <ActiveIcon />
        <ul
          class={classnames(
            'absolute top-[48px] z-50 left-1/2 -translate-x-1/2 bg-white rounded-lg ring-1 ring-slate-900/10 shadow-lg overflow-hidden w-36 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:ring-0 dark:highlight-white/5 dark:text-slate-300',
            {
              hidden: !visible.value,
            }
          )}
        >
          {themes.map((item) => {
            return (
              <li
                onClick={() => handleChosesTheme(item.origin as Theme)}
                class={classnames(
                  'py-2 px-2 flex items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-600/30',
                  {
                    'text-sky-500': item.origin === theme.value && !isSSR,
                  }
                )}
              >
                <item.Icon />
                <span class="ml-2">{item.name}</span>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
})
