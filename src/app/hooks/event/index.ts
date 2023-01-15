import { onAfterMount, onDestroyed } from 'gyron'
import { emit, on, once, off } from './event'

export { EVENT_TYPES } from './constant'

export function useEvent(type: symbol, cb?: (...args: any) => void) {
  if (cb) {
    onAfterMount(() => {
      on(type, cb)
    })
    onDestroyed(() => {
      off(type, cb)
    })
  }

  return {
    emit: (payload?: any) => emit.call(null, type, payload),
    on: () => on.call(null, type, cb),
    once: () => once.call(null, type, cb),
    off: () => off.call(null, type, cb),
  }
}
