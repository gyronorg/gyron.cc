import { FC, nextRender, onDestroyed, useValue, VNode } from 'gyron'
import { Dropdown, DropdownItem } from './dropdown'
import { EditorType } from './editor'
import { Source } from './wrapper'
import { CloseIcon, CodeIcon } from '../icons'
import classnames from 'classnames'
import { Explorer } from './constant'

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
  namespace: string
  active?: string
  children: VNode<any, TabProps>[]
  onInputChange?: (id: string, value: string) => void
  onAdd?: (type: EditorType) => Source
  onRemove?: (uuid: string) => string
  onRun?: () => void
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

export function useStandaloneNamespace(
  namespace: string,
  callback?: (err?: Error) => void
) {
  if (!window[`$${namespace}`]) {
    window[`$${namespace}`] = callback
  }

  onDestroyed(() => {
    delete window[`$${namespace}`]
  })

  return window[`$${namespace}`]
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
      if (uuid !== Explorer.Preview) {
        onActiveChange(uuid)
      }
    }
    function onRemove(e: Event) {
      e.stopPropagation()
      onTabRemove(uuid)
    }
  }
)

export const Tabs = FC<TabsProps>(
  ({ children, namespace, onAdd, onRemove, onRun, isSSR, active: _active }) => {
    const active = useValue(_active || children[0]?.props?.uuid)
    const activeUuid = useValue(null)
    const splitScreen = useValue(true)
    const runtimeErrorMessage = useValue(null)

    if (!isSSR) {
      useStandaloneNamespace(namespace, (err) => {
        runtimeErrorMessage.value = err ? err.stack : null
      })
    }

    function onAddTab(type: EditorType) {
      const { uuid } = onAdd(type)
      active.value = uuid
    }
    function onRemoveTab(uuid: string) {
      const nextUuid = onRemove(uuid)
      active.value = nextUuid
    }
    function onActive(uuid: string) {
      if (uuid === Explorer.Preview) {
        splitScreen.value = !splitScreen.value
      } else {
        active.value = uuid
      }
    }
    function onCodeRun() {
      splitScreen.value = true
      nextRender(onRun)
    }

    return ({ children, onInputChange }) => {
      const child = children.filter(
        (item) => item?.props?.uuid === active.value
      )
      const preview = children.find(
        (item) => item.props.uuid === Explorer.Preview
      )
      return (
        <div class="h-[400px] relative">
          <div class="flex relative z-30">
            {children.map((item, index) => {
              const { name, label, fixed, uuid } = item.props
              return (
                <div
                  class={classnames(
                    'px-6 py-1 text-sm cursor-pointer text-white bg-[#1e293b] dark:bg-[#00000080] group-item h-9 flex items-center',
                    {
                      'border-amber-500 border-b-2':
                        active.value === uuid ||
                        (uuid === Explorer.Preview && splitScreen.value),
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
              <DropdownItem name="typescript">TSX</DropdownItem>
              <DropdownItem name="css">CSS</DropdownItem>
            </Dropdown>
          </div>
          <div
            class="cursor-pointer absolute left-1/2 px-4 py-1 bg-slate-800 z-50 -translate-x-full border-slate-400 border border-t-0 rounded-bl-lg text-xs text-white flex items-center gap-2 min-w-[80px]"
            onClick={onCodeRun}
          >
            <CodeIcon c1="#fff" c2="#000" />
            <span>运行</span>
          </div>
          <div
            class={classnames(
              'absolute bottom-0 right-0 bg-red-900 py-2 px-3 text-red-400 z-50 max-h-40 overflow-auto w-full',
              {
                'w-1/2': splitScreen.value,
                hidden: runtimeErrorMessage.value === null,
              }
            )}
          >
            <pre>{runtimeErrorMessage.value}</pre>
          </div>
          <div class="h-[calc(100%-36px)] relative z-40 flex">
            <div
              class={classnames('h-full flex-1', {
                'w-1/2': splitScreen.value,
              })}
            >
              {child}
            </div>
            {splitScreen.value && (
              <div class={classnames('flex-1, w-1/2 border-l border-zinc-400')}>
                {preview}
              </div>
            )}
          </div>
        </div>
      )
    }
  }
)
