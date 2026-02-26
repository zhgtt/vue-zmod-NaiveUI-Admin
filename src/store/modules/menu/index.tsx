/**
 * @description: 创建菜单相关的全局状态管理
 */
import type { MenuOption } from 'naive-ui'

import { routes } from 'vue-router/auto-routes'

// * watchImmediate - 立即执行的 watch 简写（{immediate: true}）
import { watchImmediate } from '@vueuse/core'

import SvgIcon from '@/components/custom/SvgIcon.vue'
import type { IconProps } from '@/components/custom/SvgIcon.vue'

import { useLayoutStore } from '@/store'

import { convertRoutesToMenus } from './helper'
import { buildMenuKeyMap, findMenuByKey, findMenuByPath } from '@/utils'

export const useMenuStore = defineStore(
  'menu-store',
  () => {
    const vueRouter = useRouter()
    const vueRoutes = useRoute()

    const layoutStore = useLayoutStore()

    /**
     * @description: 定义全局状态
     */
    // 菜单数据
    // * 对于大型数据结构如 menuData ，可以考虑使用 shallowRef 来提高性能：
    const menuData = shallowRef<APP.Menu.MenuItem[]>([])

    // 当前选中的菜单项 key（🍄 该值不与菜单组件进行双向绑定，只是记录当前选中菜单的 key）
    const selectedKey = ref<string>()

    // 用于一级菜单双向绑定的 key（仅用于 mixedSide 模式下的一级菜单组件）
    const selectedRootKey = ref<string | null>(null)

    // 用于水平/垂直菜单组件双向绑定的 key
    const menuModelValue = ref<string>()

    // 侧边栏菜单是否折叠
    const collapsed = ref(false)

    /**
     * @description: 计算属性
     */
    // 1️⃣ 获取一级菜单数据（仅用于 mixedSide 模式下的一级菜单组件）
    const rootMenuData = computed<APP.Menu.MenuItem[]>(() => {
      return menuData.value.map(menu => ({ ...menu, children: [] }))
    })

    // 2️⃣ 垂直菜单数据（仅在垂直菜单组件中使用） - 使用计算属性代替 watch
    const verticalMenuData = computed<APP.Menu.MenuItem[]>(() => {
      // 获取当前菜单布局模式
      const navMode = layoutStore.layoutConfig.navMode
      // side 模式下，直接显示所有菜单
      if (['side'].includes(navMode))
        return menuData.value

      // 获取当前选中的根菜单项
      const currentRootMenuItem = findMenuByKey(menuData.value, selectedRootKey.value ?? '')

      // 如果当前根菜单有子菜单，则返回子菜单
      if (currentRootMenuItem && currentRootMenuItem?.children?.length) {
        return currentRootMenuItem.children
      }

      // 如果没有子菜单，返回空数组
      return []
    })

    // 3️⃣ 缓存子菜单与根菜单的映射关系（mixedSide 模式下使用）
    const menuRootKeyMap = computed<Record<string, string>>(() => {
      return buildMenuKeyMap(menuData.value)
    })

    /**
     * @description: 监听函数
     */
    // 1️⃣ 监听路由变化，设置当前菜单布局模式下的选中菜单项、侧边栏的显隐状态
    watchImmediate(
      () => vueRoutes.path,
      (path) => {
        if (path === '/')
          return

        // 获取当前菜单布局模式
        const navMode = layoutStore.layoutConfig.navMode

        // 获取当前路由对应的菜单项
        const currentMenuItem = findMenuByPath(menuData.value, path)

        // 未找到匹配菜单项时提示错误并退出
        if (!currentMenuItem) {
          console.error(`当前 ${path} 未找到匹配的菜单项`)
          return
        }

        // 更新当前选中菜单项的 key
        selectedKey.value = currentMenuItem.key

        // 🍄 使用策略模式处理不同布局模式下的逻辑
        const layoutHandlers = {
          // 🍄 side 模式下，直接显示侧边栏（因为侧边栏模式是 false） 👇️
          side: () => {
            selectedRootKey.value = null
            layoutStore.setSideBarVisible(true)
          },
          // 🍄 混合模式下，处理一级菜单选中的 key 和侧边栏的显隐状态 👇️
          mixedSide: () => {
            // 1️⃣ 刷新页面时，如果当前菜单项为没有子菜单的根菜单，直接使用其 key
            if (currentMenuItem.level === 1) {
              // 设置一级菜单的 key
              selectedRootKey.value = currentMenuItem.key
              // 不为 side 模式，则隐藏侧边栏
              layoutStore.setSideBarVisible(false)
              return
            }
            // 2️⃣ 刷新页面时，如果当前路由地址是子菜单项，则使用缓存查找根菜单key
            const cachedRootKey = menuRootKeyMap.value[currentMenuItem.key]
            // 显示侧边栏
            layoutStore.setSideBarVisible(true)
            // 设置一级菜单的 key 为从缓存中获取的根菜单 key
            if (cachedRootKey) {
              selectedRootKey.value = cachedRootKey
              return
            }
            // 如果缓存中没有找到对应的根菜单，可能是菜单数据有问题
            console.warn(`未找到菜单项 ${currentMenuItem.key} 对应的根菜单`)
          },
        }

        // 执行策略模式代码
        /**
         * ? 类型解释
         * typeof 操作符用于获取一个变量或对象的类型
         * keyof 操作符用于获取一个类型的所有键（属性名）的联合类型，这里就是 "side" | "mixedSide"
         */
        const handler = layoutHandlers[navMode as keyof typeof layoutHandlers]
        handler?.()
      },
    )

    // 2️⃣ 监听布局模式，重置一些菜单的状态
    watch(
      () => layoutStore.layoutConfig.navMode,
      () => {
        resetMenuState()
      },
      { immediate: true },
    )

    // 3️⃣ 监听 selectedKey 变化，记录 menuModelValue 的值
    watch(selectedKey, (newKey) => {
      if (newKey)
        menuModelValue.value = newKey
    })

    /**
     * @description: 功能函数
     */
    // Fun1️⃣ 根据路由数据获取所有的静态菜单
    async function initStaticMenus() {
      try {
        // resetMenuState()
        menuData.value = convertRoutesToMenus([...routes])
        console.log('menuData.value ==== 😐😐', menuData.value)
      }
      catch (error) {
        console.error('初始化静态菜单失败:', error)
        menuData.value = []
      }
    }

    // Fun2️⃣ 根据菜单项执行跳转的逻辑（包含外链），用于 vertical-menu 和 horizontal-menu 组件
    function navigateToMenuItem(key: string, menuOption: MenuOption) {
      const menuItem = menuOption as APP.Menu.MenuItem

      // 如果是外链菜单，直接打开链接
      if ('href' in menuItem) {
        window.open(menuItem.href, '_blank')

        // 恢复菜单高亮状态为当前selectedKey
        menuModelValue.value = selectedKey.value

        return
      }

      // 非外链菜单，更新selectedKey
      selectedKey.value = key

      menuRouterPush(menuItem)
    }

    // Fun3️⃣ 执行路由跳转
    function menuRouterPush(menuItem: APP.Menu.MenuItem) {
      if ('routePath' in menuItem) {
        vueRouter.push({
          path: menuItem.routePath,
          ...(menuItem?.query && { query: menuItem.query }),
        })
      }
    }

    // Fun4️⃣ 切换菜单折叠状态
    function toggleCollapsed() {
      collapsed.value = !collapsed.value
    }

    // Fun5️⃣ 设置菜单折叠状态
    function setCollapsed(value: boolean) {
      collapsed.value = value
    }

    // Fun6️⃣ 自定义渲染 label（渲染外链）
    function renderMenuLabel(item: MenuOption) {
      return item.label as string
    }

    // Fun7️⃣ 自定义渲染图标
    function renderMenuIcon(item: MenuOption) {
      // 默认情况下，会渲染图标占位符以保持缩进
      // 若返回 false 值，不再渲染图标及占位符
      if (!('iconConfig' in item)) {
        return null
      }
      return <SvgIcon {...(item.iconConfig as IconProps)} />
    }

    // Fun8️⃣ 重置一些菜单状态
    function resetMenuState() {
      selectedRootKey.value = null
    }

    // TODO 搜索菜单项
    // function searchMenuItems(keyword: string) {
    //   if (!keyword)
    //     return []

    //   const searchInMenus = (items: APP.Menu.MenuItem[]): APP.Menu.MenuItem[] => {
    //     const result: APP.Menu.MenuItem[] = []

    //     for (const item of items) {
    //       if (item.label && typeof item.label === 'string'
    //         && item.label.toLowerCase().includes(keyword.toLowerCase())) {
    //         result.push(item)
    //       }

    //       if (item.children && item.children.length) {
    //         const childResults = searchInMenus(item.children as APP.Menu.MenuItem[])
    //         result.push(...childResults)
    //       }
    //     }

    //     return result
    //   }

    //   return searchInMenus(menuData.value)
    // }

    return {
      menuData,
      rootMenuData,
      verticalMenuData,
      initStaticMenus,

      navigateToMenuItem,
      menuRouterPush,

      selectedKey,
      menuModelValue,
      selectedRootKey,

      collapsed,
      toggleCollapsed,
      setCollapsed,

      renderMenuLabel,
      renderMenuIcon,
    }
  },
  /**
   * @description: pinia 的插件配置项
   */
  {
    // 状态持久化储存插件配置
    persist: {
      key: 'menu-store',
      storage: localStorage,
      pick: ['selectedKey'],
    },
  },
)
