import { BlogReadme, BlogReadmeEn } from '@/source'
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

export const BLOG_NAV_EN: Menu = [
  {
    name: 'Introduction',
    path: '/en-US',
    children: [
      {
        path: '/en-US/blog/readme',
        name: 'Philosophy and Principles',
        anchor: BlogReadmeEn,
        component: wrapAsyncMdxContent(BlogReadmeEn),
        meta: {
          group: 'Readme',
          page: 'blog/readme',
          title: 'Philosophy and Principles',
        },
      },
    ],
  },
]

export const BLOG_ROUTE_MENUS = BLOG_NAV.map((Menu) => Menu.children).flat()
export const BLOG_ROUTE_MENUS_EN = BLOG_NAV_EN.map(
  (Menu) => Menu.children
).flat()
