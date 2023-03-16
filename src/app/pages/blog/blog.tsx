import { DocsContainer } from '@/components/container'
import { FC } from 'gyron'
import { BLOG_NAV } from './constant'

export const BlogDocs = FC(() => {
  return <DocsContainer menu={BLOG_NAV} />
})
