import { createRef, FC, onAfterMount, onDestroyed, useValue } from 'gyron'
import { AddIcon } from '../icons'
import { createPopper } from '@popperjs/core/lib/popper-lite.js'
import { EditorType } from './editor'
import classnames from 'classnames'

interface DropdownProps {
  onClick?: (type: EditorType) => void
}

export const Dropdown = FC<DropdownProps>(({ children, onClick, isSSR }) => {
  const target = createRef<HTMLElement>()
  const source = createRef<HTMLElement>()
  const visible = useValue(false)

  onAfterMount(() => {
    const popper = createPopper(target.current, source.current, {})
    console.log(source, target)
  })

  function onVisible() {
    visible.value = !visible.value
  }

  if (!isSSR) {
    window.addEventListener('click', onVisible)
    onDestroyed(() => {
      window.removeEventListener('click', onVisible)
    })
  }
  return (
    <div class="px-4 bg-slate-700 select-none">
      <div
        class="h-full flex items-center justify-center cursor-pointer"
        ref={target}
        onClick={(e) => {
          e.stopPropagation()
          visible.value = !visible.value
        }}
      >
        <AddIcon class="fill-white" />
      </div>
      <div
        class={classnames(
          visible.value ? 'opacity-100' : 'opacity-0 pointer-events-none',
          'absolute shadow-gray-800 shadow-xl'
        )}
        ref={source}
        onClick={onItemClick}
      >
        {children}
      </div>
    </div>
  )

  function onItemClick(e: Event) {
    console.log(e.target)
  }
})

interface DropdownItemProps {
  name: string
}

export const DropdownItem = FC<DropdownItemProps>(({ children, name }) => {
  return (
    <div data-name={name} class="cursor-pointer py-1 px-3 hover:bg-slate-800">
      {children}
    </div>
  )
})
