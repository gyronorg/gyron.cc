import { DocsContainer } from '@/components/container'
import { FC } from 'gyron'
import { BLOG_NAV, BLOG_NAV_EN } from './constant'
import { Lang, TranslateProviderProps } from '@/components/translate'

export const BlogDocs = FC<TranslateProviderProps>(({ lang }) => {
  return <DocsContainer menu={lang === Lang.ZH ? BLOG_NAV : BLOG_NAV_EN} />
})
