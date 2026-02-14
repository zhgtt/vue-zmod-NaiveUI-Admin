/**
 * @description: 辅助工具函数
 * 处理和转换自动生成的路由数据，将所有路由数据都封装成包含布局组件的路由
 *
 * ? @类型解释: RouteRecordRaw 类型 - vue-router 的内置类型，它的第一层级路由数据，必须要有 path、children 或 redirect
 * // @类型解释: DefinePage 类型 - unplugin-vue-router 的内置类型，它其实是把 RouteRecordRaw 中的 children、components、component 过滤掉了，还变成了可选的类型
 */
import type { RouteRecordRaw } from 'vue-router'
// // import type { DefinePage } from 'unplugin-vue-router/runtime'

import { rootRoute } from '@/constants/routes'
import { pageLayouts } from '@/constants/layout'
import { log } from 'node:console'

interface RouteTransformResult {
  baseRoutes: RouteRecordRaw[]
  blankLayoutRoutes: RouteRecordRaw[]
}

const { VITE_LAYOUT_COMPONENT = 'base' } = import.meta.env

/**
 * @description: 1️⃣ 创建根路由，指定其布局容器 为 base，完善其 children 的数据 👇
 */
function createRootRoute(children: RouteRecordRaw[]) {
  return { ...rootRoute, component: pageLayouts.base, children }
}

/**
 * @description: 2️⃣ 批量处理路由 👇
 * @param routes - 路由源数据
 */
export function transformRoutes(routes: RouteRecordRaw[]) {
  const component = pageLayouts[VITE_LAYOUT_COMPONENT]

  if (!component)
    throw new Error('请设置正确的布局容器!')

  const result: RouteTransformResult = {
    baseRoutes: [],
    blankLayoutRoutes: [],
  }

  routes.forEach(route => processRoute(route, result))

  return {
    baseRoutes: [createRootRoute(result.baseRoutes)],
    blankLayoutRoutes: result.blankLayoutRoutes,
  }
}

/**
 * @description: 3️⃣ 处理单个路由 👇
 */
function processRoute(route: RouteRecordRaw, result: RouteTransformResult) {
  // 🍄 针对有子路由的 route 进行递归处理
  if (route.children?.length) {
    route.children = route.children.map((child) => {
      processRoute(child, result)
      return child
    })
  }

  // 🍄 在基础布局下，针对某个路由页面是空白布局的情况，将其添加到 blankLayoutRoutes 中
  if (isBlankLayout(route)) {
    result.blankLayoutRoutes.push(createBlankRoute(route))
  }
  else {
    result.baseRoutes.push(route)
  }
}

// 拆分：将空白布局路由的判断逻辑单独拆分出来
function isBlankLayout(route: RouteRecordRaw): boolean {
  const { meta } = route

  // 确保 meta.blank 为布尔值，如果是 undefined 则返回 false
  return Boolean(meta?.blank)
  // && blankLayoutRoutes.findIndex((item: RouteRecordRaw) => item.name === name) === -1
}

// 拆分：创建空白布局路由数据信息 👇
function createBlankRoute(route: RouteRecordRaw) {
  const { name, path, component, meta } = route

  const routeItem: RouteRecordRaw = {
    path: path || meta?.fullPath as string,
    component: pageLayouts.blank,
    children: [
      { name, path: '', component, meta } as RouteRecordRaw,
    ],
  }
  return routeItem
}
