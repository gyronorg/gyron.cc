import { Link } from '@gyron/router'
import { FC, FCA } from 'gyron'
import { Nav } from '@/components/nav'
import { DOCS_NAV, CORE_NAV, DOCS_NAV_EN, CORE_NAV_EN } from '@/pages'
import { Skeleton } from '@/components/skeleton'
import { CardCode, CardImage } from '@/components/card'
import { ComponentIcon, LightningIcon } from '@/components/icons'
import { $t, resolveTranslate } from '@/langs'

const AsyncExplorer = FCA(() =>
  import('@/pages/explorer').then(({ Explorer }) => <Explorer />)
)

interface HomeProps {}

export const Home = FC<HomeProps>(({}) => {
  return (
    <div class="py-8 max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="hidden">
        <Nav
          menus={[...DOCS_NAV, ...CORE_NAV, ...DOCS_NAV_EN, ...CORE_NAV_EN]}
        />
      </div>
      <main>
        <div class="container mx-auto text-center my-20 md:mt-32 lg:mt-36 max-w-3xl text-slate-200 dark:text-slate-50">
          <h1 class="text-8xl font-bold">Gyron.js</h1>
          <p class="mt-4 opacity-80 text-base leading-8">
            {$t('JSXText_27_57_29_10')}
          </p>
          <p class="mt-4 opacity-80 text-base leading-8">
            {$t('gyron_sub_desc')}
          </p>
          <div class="flex justify-between mt-12 w-80 mx-auto">
            <Link
              to={resolveTranslate('/docs/installation')}
              className="focus:outline-none focus:ring-2 transition-colors duration-200 px-5 py-3 lg:px-6 border focus:bg-primary-400 border-primary-400 bg-primary-400 hover:bg-primary-600 hover:border-primary-600 text-white text-xl rounded"
            >
              {$t('JSXText_38_13_40_12')}
            </Link>
            <Link
              to={resolveTranslate('/docs/tutorial')}
              className="focus:outline-none focus:ring-2 transition-colors duration-200 px-5 py-3 lg:px-6 border focus:border-primary-400 border-primary-400 hover:border-primary-600 hover:opacity-90 dark:text-white text-xl rounded"
            >
              {$t('JSXText_44_13_46_12')}
            </Link>
          </div>
          <div class="mt-16 mb-2">
            <Link to={resolveTranslate('/explorer')} className="underline">
              {$t('JSXText_49_55_51_12')}
            </Link>
          </div>
        </div>
        <div class="container mt-16 mb-16 max-w-5xl mx-auto text-slate-200 dark:text-slate-50">
          <ul class="">
            <li>
              <CardCode
                url={resolveTranslate('/docs/instance')}
                title={
                  <span className="flex items-center space-x-2">
                    <LightningIcon />
                    <span>{$t('JSXText_62_26_62_30')}</span>
                  </span>
                }
                desc={$t('JSXAttribute_65_16_65_97')}
                codes={[
                  {
                    type: 'tsx',
                    value: `import { createInstance } from 'gyron'\ncreateInstance(<div>Hello, Gyron</div>).render('#root')`,
                  },
                ]}
              />
            </li>
            <li>
              <CardCode
                url={resolveTranslate('/docs/component')}
                title={
                  <span className="flex items-center space-x-2">
                    <ComponentIcon />
                    <span>{$t('JSXText_80_26_80_31')}</span>
                  </span>
                }
                desc={$t('JSXAttribute_83_16_83_133')}
                codes={[
                  {
                    type: 'tsx',
                    name: 'simple.tsx',
                    value: `import { FC } from 'gyron'\nexport default FC(() => <div>Hello, Gyron</div>)`,
                  },
                  {
                    type: 'tsx',
                    name: 'index.tsx',
                    value: `import { createInstance } from 'gyron'\nimport Hello from './simple'\n\ncreateInstance(<Hello />).render('#root')`,
                  },
                ]}
              />
            </li>
            <li class="border border-transparent">
              <CardImage
                src="/assets/image/ant.webp"
                url="https://github.com/gyronorg/core#%E6%A0%B8%E5%BF%83"
                title={$t('JSXAttribute_102_16_102_29')}
                desc={$t('JSXAttribute_103_16_103_134')}
              />
            </li>
            <li class="border border-transparent">
              <CardImage
                reversal
                url="https://www.typescriptlang.org/"
                src="/assets/image/elephant.webp"
                title={$t('JSXAttribute_111_16_111_30')}
                desc={$t('JSXAttribute_112_16_112_109')}
              />
            </li>
          </ul>
        </div>
        <h2 className="text-white text-2xl px-4 mt-52">
          {$t('JSXText_117_55_117_59')}
        </h2>
        <p className="text-slate-100 my-6 px-4">{$t('JSXText_118_48_120_8')}</p>
        <AsyncExplorer fallback={<Skeleton length={3} />} />
      </main>
      <footer class="pt-28 pb-10 border-slate-200 text-slate-500 dark:border-slate-200/5 text-center">
        <div class="flex justify-center">
          <div class="mb-6 sm:mb-0 sm:flex">
            <p>
              <span>Copyright © {new Date().getFullYear()} Link</span>
              <span class="sm:border-l sm:border-slate-400 sm:ml-4 sm:pl-4 block sm:inline">
                Produced with
                <a href="https://github.com/gyronorg/docs" class="underline">
                  @gyron/docs
                </a>
              </span>
            </p>
          </div>
        </div>
        <div class="mt-4">
          <a href="https://beian.miit.gov.cn/">{$t('JSXText_138_47_138_63')}</a>
        </div>
      </footer>
    </div>
  )
})
