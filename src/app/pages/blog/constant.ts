import { BlogReadme } from '@/source'
import { wrapAsyncMdxContent } from '@/utils/mdx'
import { Menu } from '@/interface/menu'

export const BLOG_NAV: Menu = [
  {
    name: '介绍',
    path: '',
    children: [
      {
        path: '/blog/readme',
        name: '理念和原理',
        anchor: BlogReadme,
        component: wrapAsyncMdxContent(BlogReadme),
        meta: {
          group: 'Readme',
          page: 'blog/readme',
          title: '理念和原理',
        },
      },
    ],
  },
]

export const BLOG_ROUTE_MENUS = BLOG_NAV.map((Menu) => Menu.children).flat()
