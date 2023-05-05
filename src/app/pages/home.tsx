import { Link } from '@gyron/router'
import { FC, FCA } from 'gyron'
import { Nav } from '@/components/nav'
import { DOCS_NAV, CORE_NAV } from '@/pages'
import { Skeleton } from '@/components/skeleton'

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
          <div class="mt-8 mb-2">
            <Link to="/explorer" className="underline">
              在线编辑(online playground)
            </Link>
          </div>
        </div>
        <div class="container mt-16 mb-16 max-w-5xl mx-auto text-slate-200 dark:text-slate-50">
          <ul class="flex justify-around space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-12">
            <li class="flex-1">
              <h2 class="text-lg">简单</h2>
              <p class="mt-4 opacity-80">
                只需要了解JavaScript基本语法和jsx语法糖就可以完全构建一个可交互的应用程序。使用脚手架还可以快速开始本地应用。
              </p>
            </li>
            <li class="flex-1">
              <h2 class="text-lg">组件</h2>
              <p class="mt-4 opacity-80">
                以函数作为组件的基础元素，就可以灵活的组织页面，并且可以追踪数据变化。还可以使用更多选项让组件可缓存，在大型项目中收益更明显。
              </p>
            </li>
            <li class="flex-1">
              <h2 class="text-lg">小巧</h2>
              <p class="mt-4 opacity-80">
                核心代码仅9kb(gzip)左右，但是功能却十分完善。不仅支持 SPA
                模式，还支持 SSR 模式，只需要做少许改动就可以让组件支持 SSR。
              </p>
            </li>
            <li class="flex-1">
              <h2 class="text-lg">类型</h2>
              <p class="mt-4 opacity-80">
                完全支持最新的 Typescript 类型推断，在构建大型项目上更加友好。
              </p>
            </li>
          </ul>
        </div>
        <AsyncExplorer fallback={<Skeleton length={3} />} />
        <div class="text-xs ml-auto mr-auto mt-4 pl-4">
          在线使用，在左边编辑完成后点击运行按钮即可预览效果。在后面阅读文档时发现代码都可以贴在编辑器中实时预览。
        </div>
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
