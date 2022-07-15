import { FC } from '@gyron/runtime'
import { DocsContainer } from '@/components/container'
import { DOCS_NAV } from './constant'

export const DocsRuntime = FC(() => {
  return () => <DocsContainer menu={DOCS_NAV} />
})
