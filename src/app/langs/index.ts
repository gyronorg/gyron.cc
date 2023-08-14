import { FC } from 'gyron'
import { Lang } from '@/components/translate'
import { join } from '@gyron/shared'
import zh from '@/langs/zh-CN.json'
import en from '@/langs/en-US.json'

const langMap = {
  [Lang.ZH]: zh,
  [Lang.EN]: en,
}

let _lang = Lang.ZH

export function $t(key: string, lang: any = _lang): string {
  if (langMap[lang]) {
    return langMap[lang][key]
  }
  return langMap[_lang][key].replace('{0}', lang)
}

export const TranslateProvider = FC<{ lang: Lang }>(({ lang, children }) => {
  _lang = lang
  return children
})

export function resolveTranslate(url: string, lang = _lang): string {
  if (lang === Lang.ZH) {
    return url
  }
  return join('/en-US', url)
}
