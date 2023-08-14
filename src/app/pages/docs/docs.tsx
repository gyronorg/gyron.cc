import { FC } from 'gyron'
import { DocsContainer } from '@/components/container'
import { DOCS_NAV, DOCS_NAV_EN } from './constant'
import { Lang, TranslateProviderProps } from '@/components/translate'

export const DocsRuntime = FC<TranslateProviderProps>(({ lang }) => {
  return <DocsContainer menu={lang === Lang.ZH ? DOCS_NAV : DOCS_NAV_EN} />
})
