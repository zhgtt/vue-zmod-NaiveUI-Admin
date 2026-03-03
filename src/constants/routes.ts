/**
 * 路由相关的常量
 */

import type { RouteRecordRaw } from 'vue-router'

const { VITE_ROOT_ROUTE_REDIRECT = '/home' } = import.meta.env

/**
 * @description: 定义根路由对象数据，该路由主要用来指定所有路由页面的布局容器，它是固定的 👇
 */
export const ROOT_ROUTE: Readonly<RouteRecordRaw> = {
  name: 'root',
  path: '/',
  redirect: VITE_ROOT_ROUTE_REDIRECT,
  meta: {
    title: 'root',
  },
} as const

/**
 * @description: 定义一些内置路由，这些路由是不参与菜单转换的，也是无视动态菜单、权限的； 🍄 根据项目需要，在这里手动添加
 */
export const BUILTIN_ROUTE_PATHS = [
  '/:404(.*)',
]
