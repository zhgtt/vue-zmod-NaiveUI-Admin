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
 * @description: 2️⃣ 根据路由路径path查找对应的菜单项
 * @param {APP.Menu.MenuItem[]} menus - 菜单数组
 * @param {string} path - 要查找的菜单path
 */
export function findMenuByPath(menus: APP.Menu.MenuItem[], path: string) {
  // 采用 es-tookit 的 find 方式实现查找
  return find(flattenMenus(menus), { routePath: path })
}

/**
 * @description: 3️⃣ 根据菜单key查找对应的菜单项
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
 * @description: 4️⃣ 查找子菜单所属的根菜单键值
 * @param {APP.Menu.MenuItem[]} menus - 菜单数组
 * @param {string} childKey - 子菜单的key
 */
export function findRootMenuKeyByChild(menus: APP.Menu.MenuItem[], childKey: string): string | null {
  for (const root of menus) {
    if (root.children && findMenuByKey(root.children, childKey))
      return root.key
  }
  return null
}

/**
 * @description: 5️⃣ 构建菜单键值映射关系，用于快速查找子菜单所属的根菜单（在初始化数据的时候使用）
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
 * @description: 获取菜单的展开路径
 */
export function getMenuOpenKeys(menus: APP.Menu.MenuItem[], path: string): string[] {
  const openKeys: string[] = []
  const findPath = (items: APP.Menu.MenuItem[], targetPath: string, parents: string[] = []) => {
    for (const item of items) {
      const currentPath = [...parents, item.key]
      if (item.routePath === targetPath) {
        openKeys.push(...parents)
        return true
      }
      if (item.children?.length && findPath(item.children, targetPath, currentPath)) {
        openKeys.push(...parents)
        return true
      }
    }
    return false
  }

  findPath(menus, path)
  return [...new Set(openKeys)]
}
