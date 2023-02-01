import { FC, nextRender, onDestroyed, useValue, VNode } from 'gyron'
import { Dropdown, DropdownItem } from './dropdown'
import { EditorType } from './editor'
import { OnAdd } from './wrapper'
import { CloseIcon, CodeIcon } from '../icons'
import { Explorer } from './constant'
import classnames from 'classnames'

interface TabProps {
  name: string
  uuid: string
  editTitle: boolean
  editContent: boolean
  remove: boolean
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
  onAdd?: OnAdd
  onRemove?: (uuid: string) => string
  onRun?: () => void
  onChangeActive?: (active: string) => void
}

interface TabEditProps {
  name: string
  uuid: string
  activeUuid: string
  label: string
  shouldRemove: boolean
  shouldEdit: boolean
  onInputChange: (id: string, value: string) => void
  onActiveChange: (uuid: string | null) => void
  onTabRemove?: (uuid: string) => void
}

export function useStandaloneNamespace(
  namespace: string,
  callback?: (err?: Error) => void
): (err?: Error) => void {
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
    shouldEdit,
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
            class="h-full text-xs group-edit opacity-0 hover:text-rose-700 transition-opacity absolute -right-4 flex items-center p-2"
            onClick={onRemove}
          >
            <CloseIcon class="w-1.5 h-1.5" />
          </div>
        )}
      </span>
    )

    function onBlur() {
      onActiveChange(null)
    }
    function onDblclick(uuid: string) {
      if (uuid !== Explorer.Preview && shouldEdit) {
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
  ({
    children,
    namespace,
    onAdd,
    onRemove,
    onRun,
    isSSR,
    active,
    onChangeActive,
  }) => {
    const activeUuid = useValue(null)
    const splitScreen = useValue(true)
    const runtimeErrorMessage = useValue(null)

    if (!isSSR) {
      useStandaloneNamespace(namespace, (err) => {
        runtimeErrorMessage.value = err ? err.stack : null
      })
    }

    if (children[0]?.props?.uuid) {
      onChangeActive(children[0].props.uuid)
    }

    function onAddTab(type: EditorType) {
      const { uuid } = onAdd(type)
      onChangeActive(uuid)
    }
    function onRemoveTab(uuid: string) {
      const nextUuid = onRemove(uuid)
      onChangeActive(nextUuid)
    }
    function onActive(uuid: string) {
      if (uuid === Explorer.Preview) {
        splitScreen.value = !splitScreen.value
      } else {
        onChangeActive(uuid)
      }
    }
    function onCodeRun() {
      splitScreen.value = true
      nextRender(onRun)
    }

    return ({ children, active, onInputChange }) => {
      const child = children.filter((item) => item?.props?.uuid === active)
      const preview = children.find(
        (item) => item.props.uuid === Explorer.Preview
      )
      return (
        <div class="h-full relative">
          <div class="flex">
            {children.map((item, index) => {
              const { name, label, fixed, uuid, editTitle, remove } = item.props
              return (
                <div
                  class={classnames(
                    'px-6 py-1 text-sm cursor-pointer text-white bg-[#1e293b] dark:bg-[#00000080] group-item h-9 flex items-center',
                    {
                      'border-amber-500 border-b-2':
                        active === uuid ||
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
                    shouldRemove={remove}
                    shouldEdit={editTitle}
                    onInputChange={onInputChange}
                    onActiveChange={(value) => (activeUuid.value = value)}
                    onTabRemove={onRemoveTab}
                  />
                </div>
              )
            })}
            <Dropdown onClick={onAddTab}>
              <DropdownItem name="typescript">TSX</DropdownItem>
              <DropdownItem name="less">LESS</DropdownItem>
            </Dropdown>
          </div>
          <div
            class={classnames(
              'cursor-pointer absolute left-1/2 px-4 py-1 bg-slate-800 z-50 -translate-x-full border-slate-400 border border-t-0 rounded-bl-lg text-xs text-white flex items-center gap-2 min-w-[80px]',
              {
                'left-full': !splitScreen.value,
              }
            )}
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
            <pre html={runtimeErrorMessage.value}></pre>
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
