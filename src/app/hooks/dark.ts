import { useValue } from 'gyron'
import { EVENT_TYPES, useEvent } from './event'

export function useDark(isSSR: boolean) {
  let mediaDark: MediaQueryList
  if (!isSSR) {
    mediaDark = window.matchMedia('(prefers-color-scheme: dark)')
  }
  const isDark = useValue(mediaDark?.matches)

  mediaDark?.addEventListener('change', (e) => {
    isDark.value = e.matches
  })

  useEvent(EVENT_TYPES.dark, (value: boolean) => {
    isDark.value = value
  })

  return isDark
}
