import { DocsContainer } from '@/components/container'
import { FC } from 'gyron'
import { CORE_NAV, CORE_NAV_EN } from './constant'
import { Lang, TranslateProviderProps } from '@/components/translate'

export const CoreDocs = FC<TranslateProviderProps>(({ lang }) => {
  return <DocsContainer menu={lang === Lang.ZH ? CORE_NAV : CORE_NAV_EN} />
})
