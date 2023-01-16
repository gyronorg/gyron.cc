import { createRef, FC, onAfterMount, useValue } from 'gyron'
import { AddIcon } from '../icons'
import { createPopper } from '@popperjs/core/lib/popper-lite.js'
import { EditorType } from './editor'
import classnames from 'classnames'

interface DropdownProps {
  onClick?: (type: EditorType) => void
}

export const Dropdown = FC<DropdownProps>(({ children, onClick }) => {
  const target = createRef<HTMLElement>()
  const source = createRef<HTMLElement>()
  const visible = useValue(false)
  onAfterMount(() => {
    const popper = createPopper(target.current, source.current, {})
  })
  return (
    <div>
      <div ref={target} onClick={() => (visible.value = !visible.value)}>
        <AddIcon />
      </div>
      <div
        class={classnames('hidden', {
          block: visible.value,
        })}
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
  return <div data-name={name}>{children}</div>
})
