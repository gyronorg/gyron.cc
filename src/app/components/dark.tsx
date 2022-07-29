import { FC, useValue } from 'gyron'
import { DarkIcon, LightIcon, SystemIcon } from './icons'
import classnames from 'classnames'
import { onDestroyed } from 'gyron'

const themeIcons = {
  light: LightIcon,
  dark: DarkIcon,
  system: SystemIcon,
}

type Theme = keyof typeof themeIcons

export const DarkToggle = FC(({ isSSR }) => {
  const theme = useValue<Theme>(
    (isSSR ? 'system' : localStorage.theme) || 'system'
  )
  const visible = useValue(false)

  const handlePopTheme = (e: Event) => {
    e.stopPropagation()
    visible.value = !visible.value
  }

  const handleChosesTheme = (themeName: Theme) => {
    theme.value = themeName
    if (themeName === 'system') {
      const mediaDark = window.matchMedia('(prefers-color-scheme: dark)')
      document.documentElement.classList.remove('dark')
      if (mediaDark.matches) {
        document.documentElement.classList.add('dark')
      }
      localStorage.removeItem('theme')
      document.cookie = 'theme=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    } else {
      localStorage.theme = themeName
      document.cookie = `theme=${themeName}; max-age=31536000`
      document.documentElement.classList.remove('dark')
      if (themeName === 'dark') {
        document.documentElement.classList.add('dark')
      }
    }
  }

  if (!isSSR) {
    const mediaDark = window.matchMedia('(prefers-color-scheme: dark)')
    if (theme.value === 'system') {
      if (mediaDark.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      mediaDark.addEventListener('change', (e) => {
        const themeName = e.matches ? 'dark' : 'light'
        theme.value = theme.value === 'system' ? 'system' : themeName
        if (themeName === 'dark') {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      })
    } else {
      if (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) && mediaDark.matches)
      ) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
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
