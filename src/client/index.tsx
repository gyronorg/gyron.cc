import { Lang } from '@/components/translate'
import { app } from '@/index'
import '@/theme/index.less'

location.pathname.startsWith('/' + Lang.EN) ? app(Lang.EN) : app(Lang.ZH)
