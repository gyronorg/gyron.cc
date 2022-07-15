import { DocsContainer } from '@/components/container'
import { FC } from '@gyron/runtime'
import { CORE_NAV } from './constant'

export const CoreDocs = FC(() => {
  return () => {
    return <DocsContainer menu={CORE_NAV} />
  }
})
