import { FC, useValue } from 'gyron'
import { DarkIcon, LightIcon, SystemIcon } from './icons'
import { onDestroyed } from 'gyron'
import { EVENT_TYPES, useEvent } from '@/hooks/event'
import classnames from 'classnames'
import { Popover } from './popover'

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

export function isDarkThemeWithWindow() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function isDarkTheme(isSSR?: boolean) {
  if (isSSR) {
    return true
  }
  if (localStorage.getItem('theme')) {
    return localStorage.getItem('theme') === 'dark'
  }
  return isDarkThemeWithWindow()
}

export const DarkToggle = FC(({ isSSR }) => {
  const theme = useValue<Theme>(
    (isSSR ? 'system' : localStorage.theme) || 'system'
  )

  const event = useEvent(EVENT_TYPES.dark)

  const handleChosesTheme = (themeName: Theme) => {
    theme.value = themeName

    // 发送主题变更事件
    event.emit(
      themeName === 'system' ? isDarkThemeWithWindow() : themeName === 'dark'
    )

    if (themeName === 'system') {
      const mediaDark = isDarkThemeWithWindow()
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
      <Popover
        content={
          <>
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
          </>
        }
      >
        <ActiveIcon />
      </Popover>
    )
  }
})
