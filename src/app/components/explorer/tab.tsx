import { FC, useValue, VNode } from 'gyron'
import classnames from 'classnames'

interface TabProps {
  name: string
  label?: string
  fixed?: 'right' | 'left'
  onInputChange?: (value: string) => void
}

export const Tab = FC<TabProps>(({ children, name, onInputChange }) => {
  const isInput = useValue(false)
  return (
    <div>
      {isInput.value ? (
        <input type="text" value={name} onChange={onChange} onBlur={onBlur} />
      ) : (
        <span class="px-2" onDblclick={onDblclick}>
          {children}
        </span>
      )}
    </div>
  )

  function onBlur() {
    isInput.value = false
  }
  function onDblclick() {
    isInput.value = true
  }
  function onChange(e: any) {
    onInputChange(e.target.value)
  }
})

interface TabsProps {
  active?: string
  children: VNode<any, TabProps>[]
}

export const Tabs = FC<TabsProps>(({ children, active: _active }) => {
  const active = useValue(_active || children[0]?.props?.name)

  return ({ children }) => {
    const child = children.filter((item) => item?.props?.name === active.value)
    return (
      <div class="h-[400px]">
        <div class="flex">
          {children.map((item) => {
            const { name, label, fixed } = item.props
            return (
              <div
                class={classnames(
                  'px-6 py-1 text-sm cursor-pointer text-white bg-[#1e293b] dark:bg-[#00000080]',
                  {
                    'border-amber-500 border-b-2': active.value === name,
                    'float-right': fixed === 'right',
                  }
                )}
                onClick={() => (active.value = name)}
              >
                {label || name}
              </div>
            )
          })}
        </div>
        <div class="h-full">{child}</div>
      </div>
    )
  }
})
