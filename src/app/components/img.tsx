import { EVENT_TYPES, useEvent } from '@/hooks/event'
import { FC, useValue } from 'gyron'
import { isDarkTheme } from './dark'

export const Image = FC<{ light: string; dark: string; alt: string }>(
  ({ light, dark, alt }) => {
    const isDark = useValue(isDarkTheme(true))
    useEvent(EVENT_TYPES.dark, (value: boolean) => {
      isDark.value = value
    })
    return (
      <div class="not-prose">
        <img src={isDark.value ? dark : light} alt={alt} />
      </div>
    )
  }
)
