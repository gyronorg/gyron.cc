import { onAfterMount, onDestroyed, UserRef } from 'gyron'

export function useElementSizeChange(
  ref: UserRef<Element>,
  method: () => void
) {
  const observer = new ResizeObserver(method)
  onAfterMount(() => {
    observer.observe(ref.current)
  })
  onDestroyed(() => {
    observer.disconnect()
  })
}
