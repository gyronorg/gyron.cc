import { FC, useValue, VNode } from 'gyron'
import { Dropdown, DropdownItem } from './dropdown'
import { EditorType } from './editor'
import classnames from 'classnames'

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
  onAdd?: (type: EditorType) => void
}

export const Tabs = FC<TabsProps>(({ children, active: _active }) => {
  const active = useValue(_active || children[0]?.props?.uuid)
  const inputUuid = useValue(null)

  return ({ children, onInputChange, onAdd }) => {
    const child = children.filter((item) => item?.props?.uuid === active.value)
    return (
      <div class="h-[400px]">
        <div class="flex relative z-50">
          {children.map((item) => {
            const { name, label, fixed, uuid } = item.props
            return (
              <div
                class={classnames(
                  'px-6 py-1 text-sm cursor-pointer text-white bg-[#1e293b] dark:bg-[#00000080]',
                  {
                    'border-amber-500 border-b-2': active.value === uuid,
                    'ml-auto order-last': fixed === 'right',
                  }
                )}
                onClick={() => (active.value = uuid)}
              >
                {inputUuid.value === uuid ? (
                  <input
                    type="text"
                    class="border focus:outline-cyan-500 border-amber-400 p-1"
                    value={name}
                    onChange={(e: any) => onInputChange(uuid, e.target.value)}
                    onBlur={onBlur}
                    autoFocus
                  />
                ) : (
                  <span class="px-2" onDblclick={() => onDblclick(uuid)}>
                    {label || name}
                  </span>
                )}
              </div>
            )
          })}
          <Dropdown onClick={onAdd}>
            <DropdownItem name="jsx">JSX</DropdownItem>
            <DropdownItem name="css">CSS</DropdownItem>
          </Dropdown>
        </div>
        <div class="h-full relative z-40">{child}</div>
      </div>
    )

    function onBlur() {
      inputUuid.value = null
    }
    function onDblclick(uuid: string) {
      inputUuid.value = uuid
    }
  }
})
