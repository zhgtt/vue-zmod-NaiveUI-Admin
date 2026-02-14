/**
 * @description: 公共的、菜单相关的辅助工具函数
 */

import { find } from 'es-toolkit/compat'
import { flattenDeep } from 'es-toolkit/array'

/**
 * @description: 1️⃣ 扁平化菜单数组
 * @param {APP.Menu.MenuItem[]} menus - 菜单数组
 */
export function flattenMenus(menus: APP.Menu.MenuItem[]): APP.Menu.MenuItem[] {
  // 实现方式一：采用 js 的 reduce 方式实现平铺
  // return (menus || []).reduce<APP.Menu.MenuItem[]>((acc, menu) => {
  //   acc.push(menu)
  //   if (menu.children?.length) {
  //     acc.push(...flattenMenus(menu.children))
  //   }
  //   return acc
  // }, [])

  // 实现方式二：采用 es-tookit 中的 flattenDeep 平铺函数
  return flattenDeep(
    (menus || []).map(menu => [
      menu,
      ...(menu.children?.length ? flattenMenus(menu.children) : []),
    ]),
  )
}

/**
 * @description: 2️⃣ 根据路由路径 path 查找其对应的菜单项
 * @param {APP.Menu.MenuItem[]} menus - 菜单数组
 * @param {string} path - 要查找的菜单path
 */
export function findMenuByPath(menus: APP.Menu.MenuItem[], path: string) {
  // 采用 es-tookit 的 find 方式实现查找
  return find(flattenMenus(menus), { routePath: path })
}

/**
 * @description: 3️⃣ 根据菜单 key 查找其对应的菜单项
 * @param {APP.Menu.MenuItem[]} menus - 菜单数组
 * @param {string} key - 要查找的菜单key
 */
export function findMenuByKey(menus: APP.Menu.MenuItem[], key: string) {
  if (!key)
    return
  // 采用 es-tookit 的 find 方式实现查找
  return find(flattenMenus(menus), { key })
}

/**
 * @description: 4️⃣ 根据菜单 key 查找其所属的根菜单项
 * @param {APP.Menu.MenuItem[]} menus - 菜单数组
 * @param {string} key - 菜单的key
 * @returns {APP.Menu.MenuItem | null} - 返回子菜单所属的根菜单数据，未找到返回 null
 */
export function findRootMenuByKey(menus: APP.Menu.MenuItem[], key: string): APP.Menu.MenuItem | null {
  // 检查是否为根菜单，是的话直接返回
  const rootMenu = find(menus, { key }) // 这里其实只是找第一层的数据
  if (rootMenu)
    return rootMenu

  // 如果不是根菜单，则在子菜单中查找并返回其所属的根菜单
  for (const root of menus) {
    if (root.children && findMenuByKey(root.children, key)) {
      return root
    }
  }
  return null
}

/**
 * @description: 5️⃣ 构建菜单键值映射关系，用于快速查找子菜单所属的根菜单的 key（在初始化数据的时候使用）
 * @param {APP.Menu.MenuItem[]} menus - 菜单数组
 * @param {Record<string, string>} keyMap - 存储映射关系的对象
 * @param {string} parentKey - 父级菜单的key
 * @returns {Record<string, string>} 子菜单key到根菜单key的映射关系
 */
export function buildMenuKeyMap(
  menus: APP.Menu.MenuItem[],
  keyMap: Record<string, string> = {},
  parentKey?: string,
): Record<string, string> {
  menus.forEach((menu) => {
    // 如果是一级菜单，它自己就是根菜单
    const rootKey = menu.level === 1 ? menu.key : parentKey

    // 如果不是一级菜单且有父级菜单，则建立映射关系
    if (menu.level !== 1 && rootKey) {
      keyMap[menu.key] = rootKey
    }

    // 递归处理子菜单
    if (menu.children?.length) {
      buildMenuKeyMap(menu.children, keyMap, rootKey)
    }
  })

  return keyMap
}

/**
 * @description: 6️⃣ 根据菜单 key 递归查找从 根菜单到当前菜单 的范围路径
 * ? 可用于获取当前菜单对应的面包屑数据
 *
 * @param {APP.Menu.MenuItem[]} menus - 菜单数组
 * @param {string} key - 菜单的key
 * @returns {APP.Menu.MenuItem[] | null} - 返回从当前节点到目标的路径数组，未找到返回 null
 */
export function findPathToNode(menus: APP.Menu.MenuItem[], key: string): APP.Menu.MenuItem[] | null {
  if (!key)
    return null

  // 查找目标菜单所属的根菜单
  const rootMenu = findRootMenuByKey(menus, key)
  if (!rootMenu)
    return null

  // 如果目标菜单就是根菜单，直接返回包含自身的路径
  if (rootMenu.key === key)
    return [rootMenu]

  // 递归查找路径的辅助函数
  const findPath = (
    menu: APP.Menu.MenuItem,
    targetKey: string,
    path: APP.Menu.MenuItem[] = [],
  ): APP.Menu.MenuItem[] | null => {
    path.push(menu)

    if (menu.key === targetKey)
      return path

    if (menu.children?.length) {
      for (const child of menu.children) {
        const result = findPath(child, targetKey, [...path])
        if (result)
          return result
      }
    }

    // 未找到，返回 null
    return null
  }

  return findPath(rootMenu, key)
}
