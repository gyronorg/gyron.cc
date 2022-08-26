import { Navigations } from '@/components/guidance'
import { MdxHelper } from '@/components/helper'
import {
  AsyncComponentFunction,
  ComponentSetupFunction,
  VNode,
  WrapperFunction,
} from 'gyron'

export type ContentMenu = Pick<MenuView, 'anchor' | 'component' | 'meta'>

export interface MenuView {
  path: string
  name: string
  anchor: Navigations
  component: WrapperFunction<{ fallback: VNode; components: object }>
  meta: {
    page: string
    title: string
    group?: string
  }
}

export type Menu = {
  name: string
  path: string
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
