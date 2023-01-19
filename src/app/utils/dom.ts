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

export function useElementMutationObserver(
  ref: UserRef<Element>,
  method: MutationCallback
) {
  const observer = new MutationObserver(method)
  const config = { attributes: true, childList: true, subtree: true }

  onAfterMount(() => {
    if (ref.current) {
      observer.observe(ref.current, config)
    }
  })

  onDestroyed(() => {
    observer.disconnect()
  })
}
