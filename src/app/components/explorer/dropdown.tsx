import { createRef, FC, onAfterMount, onDestroyed, useValue } from 'gyron'
import { AddIcon } from '../icons'
import { createPopper } from '@popperjs/core/lib/popper-lite.js'
import { SourceType } from './editor'
import classnames from 'classnames'

interface DropdownProps {
  onClick?: (type: SourceType) => void
}

export const Dropdown = FC<DropdownProps>(({ children, onClick, isSSR }) => {
  const target = createRef<HTMLElement>()
  const source = createRef<HTMLElement>()
  const visible = useValue(false)

  onAfterMount(() => {
    const popper = createPopper(target.current, source.current, {
      placement: 'right-end',
    })
  })

  function onVisible() {
    visible.value = false
  }

  if (!isSSR) {
    window.addEventListener('click', onVisible)
    onDestroyed(() => {
      window.removeEventListener('click', onVisible)
    })
  }
  return (
    <div
      class="px-4 bg-slate-200 dark:bg-slate-700 select-none sticky right-0"
      ref={target}
    >
      <div
        class="h-full flex items-center justify-center cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          visible.value = !visible.value
        }}
      >
        <AddIcon class="fill-[#334155] dark:fill-white" />
      </div>
      <div
        class={classnames(
          visible.value ? 'opacity-100' : 'opacity-0 pointer-events-none',
          'absolute dark:shadow-gray-800 shadow-xl bg-slate-100 dark:bg-[#1e293b] z-50 dark:text-yellow-400'
        )}
        ref={source}
        onClick={onItemClick}
      >
        {children}
      </div>
    </div>
  )

  function onItemClick(e: Event) {
    e.stopPropagation()
    const el = e.target as HTMLDivElement
    const type = el.dataset['name'] as SourceType
    onClick(type)
    onVisible()
  }
})

interface DropdownItemProps {
  name: SourceType
}

export const DropdownItem = FC<DropdownItemProps>(({ children, name }) => {
  return (
    <div
      data-name={name}
      class="cursor-pointer py-1 px-3 hover:bg-slate-200 hover:dark:bg-slate-600"
    >
      {children}
    </div>
  )
})
