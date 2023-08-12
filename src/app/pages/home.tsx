import { Link } from '@gyron/router'
import { FC, FCA } from 'gyron'
import { Nav } from '@/components/nav'
import { DOCS_NAV, CORE_NAV } from '@/pages'
import { Skeleton } from '@/components/skeleton'
import { CardCode, CardImage } from '@/components/card'
import { ComponentIcon, LightningIcon } from '@/components/icons'

const AsyncExplorer = FCA(() =>
  import('@/pages/explorer').then(({ Explorer }) => <Explorer />)
)

export const Home = FC(() => {
  return (
    <div class="py-8 max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="hidden">
        <Nav menus={[...DOCS_NAV, ...CORE_NAV]} />
      </div>
      <main>
        <div class="container mx-auto text-center my-20 md:mt-32 lg:mt-36 max-w-3xl text-slate-200 dark:text-slate-50">
          <h1 class="text-8xl font-bold">Gyron.js</h1>
          <p class="mt-4 opacity-80 text-base leading-8">
            简单零依赖的响应式框架
          </p>
          <p class="mt-4 opacity-80 text-base leading-8">
            Gyron.js is a minimalist version of the zero-dependency responsive
            framework
          </p>
          <div class="flex justify-between mt-12 w-80 mx-auto">
            <Link
              to="/docs/installation"
              className="focus:outline-none focus:ring-2 transition-colors duration-200 px-5 py-3 lg:px-6 border focus:bg-primary-400 border-primary-400 bg-primary-400 hover:bg-primary-600 hover:border-primary-600 text-white text-xl rounded"
            >
              开始使用
            </Link>
            <Link
              to="/docs/tutorial"
              className="focus:outline-none focus:ring-2 transition-colors duration-200 px-5 py-3 lg:px-6 border focus:border-primary-400 border-primary-400 hover:border-primary-600 hover:opacity-90 dark:text-white text-xl rounded"
            >
              查看教程
            </Link>
          </div>
          <div class="mt-16 mb-2">
            <Link to="/explorer" className="underline">
              在线编辑器(online playground)
            </Link>
          </div>
        </div>
        <div class="container mt-16 mb-16 max-w-5xl mx-auto text-slate-200 dark:text-slate-50">
          <ul class="">
            <li>
              <CardCode
                url="/docs/instance"
                title={
                  <span className="flex items-center space-x-2">
                    <LightningIcon />
                    <span>上手简单</span>
                  </span>
                }
                desc="只需要了解JavaScript基本语法和jsx语法糖就可以完全构建一个可交互的应用程序。在渲染过程中，所有结果和行为完全是可预见的，没有任何黑魔法。"
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
                url="/docs/component"
                title={
                  <span className="flex items-center space-x-2">
                    <ComponentIcon />
                    <span>组件化模式</span>
                  </span>
                }
                desc="以函数作为组件的基础元素，就可以灵活的组织页面，并且可以追踪数据变化。还可以使用更多选项让组件可缓存，在大型项目中收益更明显。如果组件更新很慢，那么还可以尝试使用 FCD 定义组件，具体表现可以点击了解更多按钮查看详情。"
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
                title="体积非常小"
                desc="核心代码小于10kb(gzip)，但是功能却十分完善。不仅支持 SPA模式，还支持 SSR 模式，只需要做少许改动就可以让组件支持 SSR。所有功能都是可以拆分，比如路由管理，如果仅仅是一个 demo 页面完全不需要引用。"
              />
            </li>
            <li class="border border-transparent">
              <CardImage
                reversal
                url="https://www.typescriptlang.org/"
                src="/assets/image/elephant.webp"
                title="强壮的生命力"
                desc="完全支持最新的 Typescript 类型推断，在构建大型项目上更加友好，在多人协作时也尤其重要。试想，当你的同事修改了一个组件的接口没有告知时，这次修改可能就是一个隐患。"
              />
            </li>
          </ul>
        </div>
        <h2 className="text-white text-2xl px-4 mt-52">在线编辑</h2>
        <p className="text-slate-100 my-6 px-4">
          在线使用，在左边编辑完成后等待3秒即可预览效果。在后面阅读文档时发现代码都可以贴在编辑器中实时预览。
        </p>
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
          <a href="https://beian.miit.gov.cn/">湘ICP备2022014933号</a>
        </div>
      </footer>
    </div>
  )
})
