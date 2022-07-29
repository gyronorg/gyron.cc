import { Navigations } from '@/components/guidance'
import { MdxHelper } from '@/components/helper'
import {
  AsyncComponentFunction,
  ComponentSetupFunction,
  VNode,
} from 'gyron'

export type ContentMenu = Pick<MenuView, 'anchor' | 'component' | 'meta'>

export interface MenuView {
  path: string
  name: string
  anchor: Navigations
  component: (props: { fallback: VNode; components: typeof MdxHelper }) => VNode
  meta: {
    page: string
    title: string
    group?: string
  }
}

export type Menu = {
  name: string
  children: MenuView[]
}[]

export interface MenusHash {
  path: string
  name: string
}

export type MenuHashView = {
  name: string
  path: string
  children: MenusHash[]
  anchor: Navigations
  component: ComponentSetupFunction | AsyncComponentFunction
}[]
