import classNames from 'classnames'
import { FC, VNode, onDestroyed, useValue } from 'gyron'

interface PopoverProps {
  content: VNode
}

export const Popover = FC<PopoverProps>(({ children, content, isSSR }) => {
  const visible = useValue(false)

  const handlePop = (e: Event) => {
    e.stopPropagation()
    visible.value = !visible.value
  }

  if (!isSSR) {
    const changeVisible = () => {
      visible.value = false
    }
    window.addEventListener('click', changeVisible)
    onDestroyed(() => {
      window.removeEventListener('click', changeVisible)
    })
  }

  return (
    <div className="relative select-none flex" onClick={handlePop}>
      <button>{children}</button>
      <ul
        class={classNames(
          'absolute top-[48px] z-50 left-1/2 -translate-x-1/2 bg-white rounded-lg ring-1 ring-slate-900/10 shadow-lg overflow-hidden w-36 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:ring-0 dark:highlight-white/5 dark:text-slate-300',
          {
            hidden: !visible.value,
          }
        )}
      >
        {content}
      </ul>
    </div>
  )
})
