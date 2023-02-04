import { FC, nextRender, onDestroyed, useValue, VNode } from 'gyron'
import { Dropdown, DropdownItem } from './dropdown'
import { EditorType } from './editor'
import { OnAdd } from './wrapper'
import { CloseIcon, CodeIcon } from '../icons'
import { Explorer } from './constant'
import { last } from 'lodash-es'
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

interface TabEditContainerProps {
  active: string
  uuid: string
  name: string
  label: string
  activeUuid: string
  fixed?: string
  splitScreen: boolean
  shouldRemove: boolean
  editTitle: boolean
  onActive: (uuid: string) => void
  onInputChange: (id: string, value: string) => void
  onActiveChange: (id: string) => void
  onRemoveTab: (uuid: string) => void
}

const TabEditContainer = FC<TabEditContainerProps>(
  ({
    active,
    uuid,
    splitScreen,
    name,
    label,
    activeUuid,
    shouldRemove,
    editTitle,
    fixed,
    onActive,
    onInputChange,
    onActiveChange,
    onRemoveTab,
  }) => {
    return (
      <div
        class={classnames(
          'px-6 py-1 text-sm cursor-pointer text-white bg-[#1e293b] dark:bg-[#00000080] group-item h-9 flex items-center',
          {
            'border-amber-500 border-b-2':
              active === uuid || (uuid === Explorer.Preview && splitScreen),
            'ml-auto order-last': fixed === 'right',
          }
        )}
        onClick={() => onActive(uuid)}
      >
        <TabEdit
          name={name}
          label={label}
          uuid={uuid}
          activeUuid={activeUuid}
          shouldRemove={shouldRemove}
          shouldEdit={editTitle}
          onInputChange={onInputChange}
          onActiveChange={onActiveChange}
          onTabRemove={onRemoveTab}
        />
      </div>
    )
  }
)

export const Tabs = FC<TabsProps>(
  ({ children, namespace, onAdd, onRemove, onRun, isSSR, onChangeActive }) => {
    const activeEditTitleId = useValue(null)
    // 是否开启预览窗口
    const splitScreen = useValue(false)
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
      const tabPreview = last(children)
      return (
        <div class="h-full relative">
          <div class="flex gap-2">
            <div class="flex max-w-[calc(100%-134px)]">
              <div class="flex overflow-x-auto overflow-y-hidden">
                {children.slice(0, -1).map((item, index) => {
                  const { name, label, fixed, uuid, editTitle, remove } =
                    item.props
                  return (
                    <TabEditContainer
                      active={active}
                      activeUuid={activeEditTitleId.value}
                      name={name}
                      label={label}
                      uuid={uuid}
                      fixed={fixed}
                      editTitle={editTitle}
                      shouldRemove={remove}
                      splitScreen={splitScreen.value}
                      onActive={onActive}
                      onInputChange={onInputChange}
                      onActiveChange={(value: string) =>
                        (activeEditTitleId.value = value)
                      }
                      onRemoveTab={onRemoveTab}
                    />
                  )
                })}
              </div>
              <Dropdown onClick={onAddTab}>
                <DropdownItem name="typescript">TSX</DropdownItem>
                <DropdownItem name="less">LESS</DropdownItem>
              </Dropdown>
            </div>
            <div class="ml-auto order-last min-w-[92px]">
              <TabEditContainer
                active={active}
                activeUuid={activeEditTitleId.value}
                name={tabPreview.props.name}
                label={tabPreview.props.label}
                uuid={tabPreview.props.uuid}
                editTitle={tabPreview.props.editTitle}
                shouldRemove={tabPreview.props.remove}
                splitScreen={splitScreen.value}
                onActive={onActive}
                onInputChange={onInputChange}
                onActiveChange={(value: string) =>
                  (activeEditTitleId.value = value)
                }
                onRemoveTab={onRemoveTab}
              />
            </div>
          </div>
          <div
            class={classnames(
              'cursor-pointer absolute left-1/2 px-4 py-1 bg-slate-800 z-50 -translate-x-full bg-[#7a9fbf2e] rounded-bl-lg text-xs text-white flex items-center gap-2 min-w-[92px]',
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
            <div
              class={classnames('flex-1, w-1/2 border-l border-zinc-400', {
                hidden: !splitScreen.value,
              })}
            >
              {preview}
            </div>
          </div>
        </div>
      )
    }
  }
)
