import { FC, useValue, VNode } from 'gyron'
import { Dropdown, DropdownItem } from './dropdown'
import { EditorType } from './editor'
import classnames from 'classnames'
import { Source } from './wrapper'
import { CloseIcon } from '../icons'

interface TabProps {
  name: string
  uuid: string
  label?: string
  fixed?: 'right' | 'left'
}

export const Tab = FC<TabProps>(({ children }) => {
  return children
})

interface TabsProps {
  active?: string
  children: VNode<any, TabProps>[]
  onInputChange?: (id: string, value: string) => void
  onAdd?: (type: EditorType) => Source
  onRemove?: (uuid: string) => string
}

interface TabEditProps {
  name: string
  uuid: string
  activeUuid: string
  label: string
  shouldRemove: boolean
  onInputChange: (id: string, value: string) => void
  onActiveChange: (uuid: string | null) => void
  onTabRemove?: (uuid: string) => void
}

const TabEdit = FC<TabEditProps>(
  ({
    name,
    activeUuid,
    label,
    uuid,
    shouldRemove,
    onInputChange,
    onActiveChange,
    onTabRemove,
  }) => {
    return activeUuid === uuid ? (
      <input
        type="text"
        class="border focus:outline-cyan-500 border-amber-400 p-1 text-zinc-700 dark:text-white"
        value={name}
        onChange={(e: any) => onInputChange(uuid, e.target.value)}
        onBlur={onBlur}
        autoFocus
      />
    ) : (
      <span
        class="px-2 select-none flex items-center gap-4 relative"
        onDblclick={() => onDblclick(uuid)}
      >
        {label || name}
        {shouldRemove && (
          <div
            class="h-full text-xs group-edit opacity-0 hover:text-rose-700 transition-opacity absolute -right-3 flex items-center"
            onClick={onRemove}
          >
            <CloseIcon class="w-2 h-2" />
          </div>
        )}
      </span>
    )

    function onBlur() {
      onActiveChange(null)
    }
    function onDblclick(uuid: string) {
      onActiveChange(uuid)
    }
    function onRemove(e: Event) {
      e.stopPropagation()
      onTabRemove(uuid)
    }
  }
)

export const Tabs = FC<TabsProps>(
  ({ children, onAdd, onRemove, active: _active }) => {
    const active = useValue(_active || children[0]?.props?.uuid)
    const activeUuid = useValue(null)

    function onAddTab(type: EditorType) {
      const { uuid } = onAdd(type)
      active.value = uuid
    }
    function onRemoveTab(uuid: string) {
      const nextUuid = onRemove(uuid)
      active.value = nextUuid
    }
    function onActive(uuid: string) {
      active.value = uuid
    }

    return ({ children, onInputChange }) => {
      const child = children.filter(
        (item) => item?.props?.uuid === active.value
      )
      return (
        <div class="h-[400px]">
          <div class="flex relative z-50">
            {children.map((item, index) => {
              const { name, label, fixed, uuid } = item.props
              return (
                <div
                  class={classnames(
                    'px-6 py-1 text-sm cursor-pointer text-white bg-[#1e293b] dark:bg-[#00000080] group-item h-9 flex items-center',
                    {
                      'border-amber-500 border-b-2': active.value === uuid,
                      'ml-auto order-last': fixed === 'right',
                    }
                  )}
                  onClick={() => onActive(uuid)}
                >
                  <TabEdit
                    name={name}
                    label={label}
                    uuid={uuid}
                    activeUuid={activeUuid.value}
                    shouldRemove={fixed !== 'right' && index !== 0}
                    onInputChange={onInputChange}
                    onActiveChange={(value) => (activeUuid.value = value)}
                    onTabRemove={onRemoveTab}
                  />
                </div>
              )
            })}
            <Dropdown onClick={onAddTab}>
              <DropdownItem name="typescript">JSX</DropdownItem>
              <DropdownItem name="css">CSS</DropdownItem>
            </Dropdown>
          </div>
          <div class="h-full relative z-40">{child}</div>
        </div>
      )
    }
  }
)
