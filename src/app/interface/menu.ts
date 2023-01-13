import { Navigation } from '@/components/guidance'
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
  anchor: Navigation
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
  anchor: Navigation
  component: ComponentSetupFunction | AsyncComponentFunction
}[]
