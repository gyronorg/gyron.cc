import { DocsContainer } from '@/components/container'
import { FC } from 'gyron'
import { CORE_NAV } from './constant'

export const CoreDocs = FC(() => {
  return <DocsContainer menu={CORE_NAV} />
})
