import { storeState } from '@/store'
import { invokeWithGetMdxAnchor } from '@/utils/mdx'
import { onAfterRouteUpdate } from '@gyron/router'
import {
  useComputed,
  defineProps,
  FC,
  nextRender,
  onDestroyed,
  useValue,
  useReactive,
} from '@gyron/runtime'
import { ArrowRightIcon } from './icons'
import { Skeleton } from './skeleton'
import classnames from 'classnames'

export type Navigations = () => Promise<typeof import('*.mdx')>

export interface NavigationBar {
  type: 'h2' | 'h3'
  name: string
}

export interface GuidanceProps {
  navigations: Navigations
}

function useScroll(isSSR: boolean) {
  const scroll = useReactive({
    top: 0,
    left: 0,
  })
  function onScroll() {
    scroll.top = document.documentElement.scrollTop
    scroll.left = document.documentElement.scrollLeft
  }
  if (!isSSR) {
    onScroll()
    document.addEventListener('scroll', onScroll)
    onDestroyed(() => {
      document.removeEventListener('scroll', onScroll)
    })
  }
  return scroll
}

const loaded: Navigations[] = []

export const Guidance = FC<GuidanceProps>(({ isSSR }) => {
  const props = defineProps<GuidanceProps>()
  const navigations = useValue<NavigationBar[]>([])
  const loading = useValue(true)
  const scroll = useScroll(isSSR)
  const position = storeState.guidance
  const fuzzyAccuracy = 2

  const activename = useComputed(() => {
    const top = Object.keys(position)
      .reverse()
      .find((top) => scroll.top >= Number(top) - fuzzyAccuracy)
    return position[top]
  }, [() => scroll.top])

  function updateNavigations() {
    if (!loaded.includes(props.navigations)) {
      loaded.push(props.navigations)
      loading.value = true
    }
    invokeWithGetMdxAnchor(props.navigations).then((value) => {
      navigations.value = value
      loading.value = false
    })
  }

  onAfterRouteUpdate(() => {
    nextRender(updateNavigations)
  })

  updateNavigations()

  return () => {
    return (
      <div
        class={classnames(
          'fixed z-20 top-[3.8125rem] bottom-0 right-[max(0px,calc(50%-45rem))] w-[19.5rem] py-10 px-8 overflow-y-auto hidden xl:block'
        )}
      >
        <h5 class="text-slate-900 font-semibold mb-4 text-sm leading-6 dark:text-slate-100">
          页面导航栏
        </h5>
        <ul class="text-slate-700 text-sm leading-6 list-none">
          {loading.value ? (
            <Skeleton length={2} />
          ) : (
            navigations.value.map((navigation) => (
              <li
                class={classnames('pl-0', {
                  'ml-4': navigation.type === 'h3',
                })}
              >
                <a
                  href={`#${navigation.name}`}
                  class={classnames(
                    'flex py-1',
                    activename.value === navigation.name
                      ? 'font-medium text-sky-500 dark:text-sky-400'
                      : 'group items-start no-underline hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300'
                  )}
                >
                  {navigation.type === 'h3' && <ArrowRightIcon />}
                  {navigation.name}
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    )
  }
})
