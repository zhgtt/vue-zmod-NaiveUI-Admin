/**
 * @description: 处理/转换菜单数据
 * 1. 将文件路由数据转换成对应的菜单数据
 * 2. 目录文件下的 index.vue 文件可以是配置文件也可以是页面文件，当为配置文件时，这个目录下的文件都被会转换成嵌套菜单
 * 3. 如果创建的是 [任意名].vue 文件，则会被认定为页面文件，会直接转换成菜单
 * 2. TODO 处理动态菜单数据的转换
 * 3. TODO 处理菜单数据的动态徽章
 */
import type { RouteRecordRaw } from 'vue-router'

import { cloneDeep, pickBy } from 'es-toolkit/object'
import { orderBy } from 'es-toolkit/array'

import { builtinRoutePaths } from '@/constants/routes'
import { customMenuItems } from '@/constants/menus'

/**
 * @description: 创建基础菜单数据
 */
function createBaseMenuItem(route: RouteRecordRaw): APP.Menu.MenuItem {
  const { name, meta } = route

  // 获取菜单属性
  const menuProps = meta?.menuProps || {}

  // 🍄 isChildMenu 默认为 true，也就是所有的目录默认都为 菜单项
  const { customLabel, ...restMenuProps } = menuProps

  return {
    key: name as string,
    label: customLabel || meta?.title || name as string,
    // ...(isChildMenu && { routePath: meta?.fullPath }), // 🍄 所在目录为 菜单项，才有 routePath 属性
    routePath: meta?.fullPath, // 不区分是否为 菜单项，都有 routePath 属性（为了兼容面包屑的路由跳转）
    query: meta?.query || {}, // 提取 meta 中的 query
    ...restMenuProps,
  }
}

/**
 * @description: 检查是否为目录文件（路由中没有 name 的数据即为目录文件）
 */
function isDirRoute(route: RouteRecordRaw) {
  return !route.name
}

/**
 * @description: 获取目录文件下的 index.vue 文件（路由中 path = '' 的数据）
 */
function getIndexRoute(routeChildren?: RouteRecordRaw[]) {
  return routeChildren?.find(item => !item.path)
}

/**
 * @description: 检查是否为动态路由（path 中以 : 为开头的数据）
 */
function isDynamicRoute(route: RouteRecordRaw) {
  return route.path.startsWith(':')
}

/**
 * @description: 1️⃣ 批量将路由数据转换为菜单 👇
 */
export function convertRoutesToMenus(routes: RouteRecordRaw[]) {
  // 🍄 过滤掉内置路由，这些路由无需参与菜单转换
  const validRoutes = routes.filter(route => !builtinRoutePaths.includes(route.path)) // js 写法

  // 🍄 深度 clone 一下，别影响原 route 数据
  const clonedRoutes = cloneDeep(validRoutes)

  try {
    // 获取路由转换后的菜单
    const routeMenus = processRoutesToMenus(clonedRoutes)

    // 🍄 合并自定义菜单
    return mergeCustomMenus(routeMenus)
  }
  catch (error) {
    console.error('菜单转换失败:', error)
    return []
  }
}

/**
 * @description: 2️⃣ 拆分：处理路由，包含 递归处理子路由，将路由数据转换成菜单数据，并进行排序
 */
function processRoutesToMenus(routes: RouteRecordRaw[], level = 1): APP.Menu.MenuItem[] {
  if (!routes.length)
    return []

  const menus = routes
    .map(routeItem => convertRouteToMenuItem(routeItem, level))
    .filter(Boolean) as APP.Menu.MenuItem[]

  return sortMenuItems(menus)
}

/**
 * @description: 3️⃣ 单个路由数据转换 👇
 */
function convertRouteToMenuItem(route: RouteRecordRaw, level = 1) {
  const { meta: routeMeta } = route
  const { hideInMenu = false } = routeMeta?.menuProps || {}

  // 🍄 判断菜单是否隐藏（针对非目录级别的菜单）
  if (hideInMenu)
    return null

  // 🍄 判断是否为动态路由，如果是，则直接返回 null
  if (isDynamicRoute(route)) {
    return null
  }

  let menuItem = createBaseMenuItem(route)

  // 添加层级字段
  menuItem.level = level

  // 🍄 处理目录类型路由
  if (isDirRoute(route)) {
    const dirMenuItem = handleDirRoute(route, level)

    if (!dirMenuItem)
      return null

    menuItem = dirMenuItem
  }

  // 🍄 过滤掉 menuItem 对象中的空值
  return pickBy(menuItem, value => Boolean(value)) as APP.Menu.MenuItem
}

/**
 * @description: 4️⃣ 拆分：处理文件夹目录类型的路由，简言之，就是处理 文件夹目录下 index.vue 文件；
 */
function handleDirRoute(route: RouteRecordRaw, level = 1): APP.Menu.MenuItem | null {
  const { path, children } = route

  // 获取目录下 index.vue 文件
  const indexRoute = getIndexRoute(children)

  if (!indexRoute) {
    throw new Error(`菜单转换失败：${path} 目录下缺少 index.vue 文件`)
  }

  // 🍄 index.vue 的作用不管是路由文件，还是配置文件，在生成菜单数据时，都应获取它定义的 meta 数据
  const { meta: indexRouteMeta } = indexRoute
  const { isChildMenu = true, hideInMenu = false } = indexRouteMeta?.menuProps || {}

  // 如果设置了隐藏，直接返回 null
  if (hideInMenu)
    return null

  /**
   * 🍄 根据 isChildMenu 属性来做判断
   */
  if (!isChildMenu && children?.length) {
    // 🍄 为 true 时，index.vue 是路由页面，所在目录是一个独立的 子菜单项，不应该有 children 属性
    // 🍄 为 false 时，index.vue 只是一个配置文件，不应该作为菜单项显示，需要从 children 中删除掉
    // 🍄 index.vue 文件生成的路由数据，都会在 children 数组的第一项，所以直接删除第一项即可
    children.shift()
  }

  const indexMenuItem = createBaseMenuItem(indexRoute)

  // 添加层级字段
  indexMenuItem.level = level

  return {
    ...indexMenuItem,
    ...(!isChildMenu && { children: processRoutesToMenus(children || [], level + 1) }), // 🍄 所在目录为 折叠菜单（父级菜单），才有 children 属性
  }
}

/**
 * @description: 5️⃣ 合并自定义菜单 到 路由生成的菜单数据中 👇
 */
function mergeCustomMenus(menus: APP.Menu.MenuItem[]) {
  // 深拷贝菜单数据
  const result = cloneDeep(menus)

  // 递归查找并添加菜单项
  const addMenuItem = (items: APP.Menu.MenuItem[], customItem: APP.Menu.MenuItem, level = 1) => {
    const { parentKey } = customItem

    // 没有父级菜单，直接添加到第一层级
    if (!parentKey) {
      // 设置自定义菜单的层级
      customItem.level = level

      items.push(customItem)
      return true
    }

    // 查找父级菜单
    for (const item of items) {
      if (item.key === parentKey) {
        // 检查父级菜单是否为单独的菜单项，是的话不允许添加子菜单
        if (!item.children && item.routePath)
          throw new Error(`菜单合并失败：${item.label}(${item.key}) 是菜单项，不能添加子菜单`)

        // 添加子菜单项
        item.children = item.children || []

        // 设置子菜单的层级为父级层级+1
        customItem.level = (item.level || 1) + 1

        item.children.push(customItem)
        item.children = sortMenuItems(item.children)
        return true
      }

      // 递归处理子菜单
      if (item.children?.length && addMenuItem(item.children, customItem, (item.level || 1) + 1))
        return true
    }
    return false
  }

  // 处理所有自定义菜单项
  customMenuItems.forEach(item => addMenuItem(result, item, 1))

  return sortMenuItems(result)
}

/**
 * @description: 6️⃣ 拆分：菜单排序 👇
 */
function sortMenuItems(items: APP.Menu.MenuItem[]): APP.Menu.MenuItem[] {
  // 🍄 TODO 这里后期需要改，不能默认用最大值
  // 确保所有菜单项都有 order 值，未设置的默认为最大值，排在末尾
  const itemsWithOrder = items.map(item => ({
    ...item,
    order: item.order ?? Number.MAX_SAFE_INTEGER,
  }))

  // * 使用 es-toolkit 库的 orderBy 方法进行排序；🍄 asc 升序，desc - 降序
  // 🍄 多字段排序：优先按 order 排序，相同 order 的按 label 排序
  return orderBy(itemsWithOrder, ['order', 'label'], ['asc', 'asc'])
}

/**
 * @description: 7️⃣ TODO 转换动态菜单（因为有权限，会影响面包屑的跳转，尤其是嵌套路由） 👇
 */
