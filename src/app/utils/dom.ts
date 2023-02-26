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

export function isInViewport(el: Element) {
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
