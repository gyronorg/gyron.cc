import {
  FC,
  nextRender,
  onDestroyed,
  useValue,
  VNode,
  WrapperFunction,
} from 'gyron'
import { Dropdown, DropdownItem } from './dropdown'
import { SourceType } from './editor'
import { OnAdd, Source } from './wrapper'
import { CloseIcon, CodeIcon, LessIcon, TsxIcon } from '../icons'
import { Explorer } from './constant'
import { last } from 'lodash-es'
import classnames from 'classnames'
import { getEditorWithElement, getModal } from './hook'

interface TabProps {
  source: Source
}

const AMap: Record<
  SourceType,
  {
    suffix: string
    Component: WrapperFunction<any>
  }
> = {
  less: {
    suffix: '.less',
    Component: LessIcon,
  },
  typescript: {
    suffix: '.tsx',
    Component: TsxIcon,
  },
}

export const Tab = FC<TabProps>(({ children }) => {
  return children
})

interface TabsProps {
  namespace: string
  active?: string
  content: VNode
  children: VNode<any, TabProps>[]
  onInputChange?: (id: string, value: string) => void
  onAdd?: OnAdd
  onRemove?: (uuid: string) => string
  onRun?: () => void
  onChangeActive?: (active: string) => void
}

interface TabEditProps {
  source: Source
  activeUuid: string
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
  ({ source, activeUuid, onInputChange, onActiveChange, onTabRemove }) => {
    const { uuid, name, label, remove, editTitle, type } = source
    const _name = (label || name).replace(/\.(less|tsx)$/, '')
    return activeUuid === uuid ? (
      <input
        type="text"
        class="border focus:outline-cyan-500 border-amber-400 p-1 text-zinc-700 dark:text-white relative z-10"
        value={_name}
        onChange={(e: any) =>
          onInputChange(uuid, `${e.target.value}${AMap[type].suffix}`)
        }
        onBlur={onBlur}
        autoFocus
      />
    ) : (
      <span
        class="px-2 select-none flex items-center gap-4 relative z-10"
        onDblclick={() => onDblclick(uuid)}
      >
        {_name}
        {remove && (
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
      if (uuid !== Explorer.Preview && editTitle) {
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
  source: Source
  active: string
  activeUuid: string
  splitScreen: boolean
  onActive: (uuid: string) => void
  onInputChange: (id: string, value: string) => void
  onActiveChange: (id: string) => void
  onRemoveTab: (uuid: string) => void
}

const TabEditContainer = FC<TabEditContainerProps>(
  ({
    active,
    splitScreen,
    activeUuid,
    source,
    onActive,
    onInputChange,
    onActiveChange,
    onRemoveTab,
  }) => {
    return () => {
      const { uuid, type } = source
      const { Component } = AMap[type]
      return (
        <div
          class={classnames(
            'backdrop-blur border-b-2 border-transparent relative px-6 py-1 text-sm cursor-pointer fill-black dark:fill-white dark:text-white bg-slate-100 dark:bg-[#1e293b] group-item h-9 flex items-center',
            {
              'border-amber-500':
                active === uuid || (uuid === Explorer.Preview && splitScreen),
              'ml-auto order-last': uuid === Explorer.Preview,
            }
          )}
          onClick={() => onActive(uuid)}
        >
          <TabEdit
            source={source}
            activeUuid={activeUuid}
            onInputChange={onInputChange}
            onActiveChange={onActiveChange}
            onTabRemove={onRemoveTab}
          />
          {uuid !== Explorer.Preview && (
            <Component class="fill-black/5 dark:fill-white/5 absolute left-1/2 -translate-x-1/2 h-10" />
          )}
        </div>
      )
    }
  }
)

export const Tabs = FC<TabsProps>(
  ({
    children,
    content,
    namespace,
    onAdd,
    onRemove,
    onRun,
    isSSR,
    onChangeActive,
  }) => {
    const activeEditTitleId = useValue(null)
    // 是否开启预览窗口
    const splitScreen = useValue(true)
    const runtimeErrorMessage = useValue(null)

    if (!isSSR) {
      useStandaloneNamespace(namespace, (err) => {
        runtimeErrorMessage.value = err ? err.stack : null
      })
    }

    if (children[0]?.props?.source?.uuid) {
      onChangeActive(children[0].props.source.uuid)
    }

    async function onAddTab(type: SourceType) {
      const { uuid, name } = onAdd(type)
      const { uri } = await getModal(name, namespace)
      const { editor, monaco } = getEditorWithElement(namespace)
      editor.createModel('', type, uri)
      monaco.languages.typescript.typescriptDefaults.addExtraLib('', uri.toString())
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
      const preview = children.find(
        (item) => item.props.source.uuid === Explorer.Preview
      )
      const tabPreview = last(children)
      return (
        <div class="h-full relative shadow-lg dark:shadow-black/25">
          <div class="flex gap-2">
            <div class="flex max-w-[calc(100%-134px)]">
              <div class="flex overflow-x-auto overflow-y-hidden">
                {children.slice(0, -1).map((item, index) => {
                  return (
                    <TabEditContainer
                      source={item.props.source}
                      active={active}
                      activeUuid={activeEditTitleId.value}
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
            {/* <div class="ml-auto order-last min-w-[92px]">
              <TabEditContainer
                source={tabPreview.props.source}
                active={active}
                activeUuid={activeEditTitleId.value}
                splitScreen={splitScreen.value}
                onActive={onActive}
                onInputChange={onInputChange}
                onActiveChange={(value: string) =>
                  (activeEditTitleId.value = value)
                }
                onRemoveTab={onRemoveTab}
              />
            </div> */}
          </div>
          {/* <div
            class={classnames(
              'cursor-pointer absolute left-1/2 px-4 py-1 dark:bg-slate-800 z-50 -translate-x-full bg-[#7a9fbf2e] rounded-bl-lg text-xs dark:text-white flex items-center gap-2 min-w-[92px]',
              {
                'left-full': !splitScreen.value,
              }
            )}
            onClick={onCodeRun}
          >
            <CodeIcon c1="#fff" c2="#000" />
            <span>运行</span>
          </div> */}
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
              {content}
            </div>
            <div
              class={classnames('flex-1, w-1/2 border-l border-transparent', {
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
