import {
  FC,
  nextRender,
  onAfterMount,
  useValue,
  VNode,
  WrapperFunction,
} from 'gyron'
import { Dropdown, DropdownItem } from './dropdown'
import { SourceType } from './editor'
import { OnAdd, Source } from './wrapper'
import { CloseIcon, LessIcon, ShareIcon, TsxIcon } from '../icons'
import { Explorer } from './constant'
import { getEditorWithElement, getModal } from './hook'
import { getEnvironment, useMountWithStandalone } from './standalone'
import { encode } from 'js-base64'
import classnames from 'classnames'

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
  preview: VNode
  sources: Source[]
  children: VNode<any, TabProps>[]
  onInputChange?: (id: string, value: string) => void
  onAdd?: OnAdd
  onRemove?: (uuid: string) => string
  onChangeActive?: (active: string) => void
}

interface TabEditProps {
  source: Source
  activeUuid: string
  onInputChange: (id: string, value: string) => void
  onActiveChange: (uuid: string | null) => void
  onTabRemove?: (uuid: string) => void
}

function useStandaloneNamespace(
  namespace: string,
  runtimeCallback?: (err?: Error) => void,
  callback?: (err?: Error) => void
) {
  useMountWithStandalone(() => {
    const { window } = getEnvironment(namespace)
    if (!window[`$${namespace}`]) {
      window[`$${namespace}`] = {
        runtime: runtimeCallback,
        building: callback,
      }
    }
  })
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
  onActive: (uuid: string) => void
  onInputChange: (id: string, value: string) => void
  onActiveChange: (id: string) => void
  onRemoveTab: (uuid: string) => void
}

const TabEditContainer = FC<TabEditContainerProps>(
  ({
    active,
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
            'backdrop-blur border-b-2 relative px-6 py-1 text-sm cursor-pointer fill-black dark:fill-white dark:text-white bg-slate-100 dark:bg-[#1e293b] group-item h-9 flex items-center',
            {
              'border-amber-500': active === uuid || uuid === Explorer.Preview,
              'border-transparent': !(
                active === uuid || uuid === Explorer.Preview
              ),
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
    sources,
    isSSR,
    onAdd,
    onRemove,
    onChangeActive,
  }) => {
    const activeEditTitleId = useValue(null)
    const runtimeErrorMessage = useValue(null)
    const buildingErrorMessage = useValue(null)

    if (!isSSR) {
      useStandaloneNamespace(
        namespace,
        (err) => {
          runtimeErrorMessage.value = err ? err.stack : null
        },
        (err) => {
          buildingErrorMessage.value = err ? err.stack : null
        }
      )
    }

    async function onAddTab(type: SourceType) {
      const { uuid, name } = onAdd(type)
      const { uri } = await getModal(name, namespace)
      const { editor, monaco } = getEditorWithElement(namespace)
      editor.createModel('', type, uri)
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        '',
        uri.toString()
      )
      onChangeActive(uuid)
    }
    function onRemoveTab(uuid: string) {
      const nextUuid = onRemove(uuid)
      onChangeActive(nextUuid)
    }
    function onActive(uuid: string) {
      if (uuid === Explorer.Preview) {
        // ...
      } else {
        onChangeActive(uuid)
      }
    }
    async function onShare() {
      try {
        const origin = location.origin + '/explorer'
        const hash = encode(JSON.stringify(sources))
        await navigator.clipboard.writeText(`${origin}#${hash}`)
        location.hash = hash
        alert('拷贝成功，快去分享吧')
      } catch {
        alert('拷贝失败，请允许访问粘贴板')
      }
    }

    return ({ preview, active, onInputChange }) => {
      return (
        <div class="h-full relative shadow-lg dark:shadow-black/25">
          <div class="flex gap-2">
            <div class="flex w-full">
              <div class="flex overflow-x-auto overflow-y-hidden">
                {children.slice(0, -1).map((item, index) => {
                  return (
                    <TabEditContainer
                      source={item.props.source}
                      active={active}
                      activeUuid={activeEditTitleId.value}
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
              <div
                class="px-4 bg-slate-100 dark:bg-slate-700 select-none ml-auto flex items-center cursor-pointer"
                onClick={onShare}
              >
                <ShareIcon />
              </div>
            </div>
          </div>
          <div
            class={classnames(
              'absolute bottom-0 right-0 bg-red-900 py-2 px-3 text-red-400 z-50 max-h-40 overflow-auto lg:w-1/2 w-full',
              {
                hidden:
                  runtimeErrorMessage.value === null &&
                  buildingErrorMessage.value === null,
              }
            )}
          >
            <pre
              class={classnames({ hidden: runtimeErrorMessage.value === null })}
              html={runtimeErrorMessage.value}
            ></pre>
            <pre
              class={classnames({
                hidden: buildingErrorMessage.value === null,
              })}
              html={buildingErrorMessage.value}
            ></pre>
          </div>
          <div class="h-[calc(100%-36px)] relative z-40 flex flex-col lg:flex-row">
            <div class={classnames('h-1/2 lg:h-full flex-1 w-full lg:w-1/2')}>
              {content}
            </div>
            <div
              class={classnames(
                'flex-1 w-full lg:w-1/2 h-1/2 lg:h-full border-l border-transparent overflow-auto'
              )}
            >
              {preview}
            </div>
          </div>
        </div>
      )
    }
  }
)
