import { Link } from '@gyron/router'
import { FC } from '@gyron/runtime'

export const Home = FC(() => {
  return (
    <div class="py-8 max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
      <div class="container mx-auto text-center my-20 md:mt-32 lg:mt-36 max-w-3xl text-slate-200 dark:text-slate-50">
        <h1 class="text-8xl font-bold">Gyron</h1>
        <p class="mt-4 opacity-80 text-base leading-8">
          一款简单零依赖的响应式框架
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
        <div class="container mt-24 mx-auto">
          <ul class="flex justify-around space-x-6 sm:space-x-8 md:space-x-12 lg:space-x-16">
            <li>
              <h3 class="text-lg">简单</h3>
              <p class="mt-4 opacity-80">
                只需要了解JavaScript基本语法和jsx就可以完全构建一个可交互的应用程序。
              </p>
            </li>
            <li>
              <h3 class="text-lg">组件</h3>
              <p class="mt-4 opacity-80">
                以函数作为组件的基础元素，就可以灵活的组织页面，并且可以追踪数据变化。
              </p>
            </li>
            <li>
              <h3 class="text-lg">小巧</h3>
              <p class="mt-4 opacity-80">
                核心代码仅6kb(gzip)左右，但是功能却十分完善。
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div class="max-w-6xl mx-auto mt-32">
        <p
          class="codepen"
          data-preview="true"
          data-height="500"
          data-slug-hash="ExQNxGR"
          data-user="linkontoask"
        >
          <span>
            See the Pen
            <a href="https://codepen.io/linkontoask/pen/ExQNxGR">
              Gyron Hello World
            </a>
            by Link (<a href="https://codepen.io/linkontoask">@linkontoask</a>)
            on <a href="https://codepen.io">CodePen</a>.
          </span>
        </p>
        <script
          async
          src="https://cpwebassets.codepen.io/assets/embed/ei.js"
        ></script>
      </div>
      <footer class="pt-28 pb-10 border-slate-200 text-slate-500 dark:border-slate-200/5 text-center">
        <div class="flex justify-center">
          <div class="mb-6 sm:mb-0 sm:flex">
            <p>
              <span>Copyright © {new Date().getFullYear()} Link</span>
              <span class="sm:border-l sm:border-slate-400 sm:ml-4 sm:pl-4 block sm:inline">
                Produced with @gyron/docs
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
