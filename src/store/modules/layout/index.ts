/**
 * 创建布局相关的全局状态管理模块
 */
import { useMenuStore } from '@/store'

import {
  defaultFooterConfig,
  defaultHeaderConfig,
  defaultLayoutConfig,
  defaultSidebarConfig,
  defaultTabsConfig,
} from '@/constants/layout'

export const useLayoutStore = defineStore(
  'layout-store',
  () => {
    // 菜单相关
    const menuStore = useMenuStore()

    // 布局容器配置
    const layoutConfig = ref<APP.Layout.LayoutConfig>({ ...defaultLayoutConfig })

    // 顶部栏配置
    const headerConfig = ref<APP.Layout.HeaderConfig>({ ...defaultHeaderConfig })

    // 侧边栏宽度
    const sideBarWidth = ref(defaultSidebarConfig.width)
    // 侧边栏可见性
    const sideBarVisible = ref(false)
    // 侧边栏配置
    const sideBarConfig = ref<APP.Layout.SidebarConfig>({ ...defaultSidebarConfig })

    // 底部栏配置
    const footerConfig = ref<APP.Layout.FooterConfig>({ ...defaultFooterConfig })

    // 动态更改布局组件的样式
    const asyncStyle = ref({
      sideOffsetTop: 0, // 侧边栏距离窗口顶部的距离（用于 siderBar 组件）
      headerOffsetLeft: 0, // 距离窗口左侧的距离（用于 header 组件）
      contentOffsetLeft: 0, // 距离窗口左侧的距离（用于 content、footer 组件）
      sideBarZIndex: 99, // 侧边栏的 z-index 值（用于 siderBar 组件）
    })

    // 1️⃣ 监听导航模式变化，动态更改样式
    watchEffect(() => {
      const mode = layoutConfig.value.navMode

      const { height: headerHeight } = headerConfig.value
      const sideWidth = sideBarVisible.value ? sideBarWidth.value : 0

      asyncStyle.value = {
        sideOffsetTop: ['mixedSide'].includes(mode) ? headerHeight : 0,
        headerOffsetLeft: ['side'].includes(mode) ? sideWidth : 0,
        contentOffsetLeft: !['top'].includes(mode) ? sideWidth : 0,
        sideBarZIndex: ['side', 'mixedSide'].includes(mode) ? 95 : 99,
      }
    })

    // 2️⃣ 监听菜单折叠变化，动态更改侧边栏的宽度
    watchEffect(() => {
      // 直接从 menuStore 获取 collapsed 的当前值，而不是使用 storeToRefs
      const isCollapsed = menuStore.collapsed

      sideBarWidth.value = isCollapsed
        ? sideBarConfig.value.collapsedWidth
        : sideBarConfig.value.width
    })

    // Fun1️⃣ 更新布局容器配置
    function updateLayoutConfig(config: Partial<APP.Layout.LayoutConfig>) {
      layoutConfig.value = { ...layoutConfig.value, ...config }
    }

    // Fun2️⃣ 更新顶部栏配置
    function updateHeaderConfig(config: Partial<APP.Layout.HeaderConfig>) {
      headerConfig.value = { ...headerConfig.value, ...config }
    }

    // Fun3️⃣ 设置侧边栏可见性
    // ! 因为有些页面不需要侧边栏，所以单独拆分出来一个公共方法来实现
    function setSideBarVisible(visible: boolean) {
      sideBarVisible.value = visible
    }

    // Fun4️⃣ 更新侧边栏配置
    function updateSideBarConfig(config: Partial<APP.Layout.SidebarConfig>) {
      sideBarConfig.value = { ...sideBarConfig.value, ...config }
    }

    // Fun5️⃣ 更新底部栏配置
    function updateFooterConfig(config: Partial<APP.Layout.FooterConfig>) {
      footerConfig.value = { ...footerConfig.value, ...config }
    }

    return {
      layoutConfig,
      updateLayoutConfig,

      headerConfig,
      updateHeaderConfig,

      sideBarWidth,
      sideBarVisible,
      sideBarConfig,
      setSideBarVisible,
      updateSideBarConfig,

      footerConfig,
      updateFooterConfig,

      asyncStyle,
    }
  },

  /**
   * @description: pinia 的插件配置项
   */
  {
    // 状态持久化储存插件配置
    persist: {
      key: 'layout-store', // 自定义浏览器缓存数据中的 key 的值
      storage: localStorage, // 浏览器储存方式，默认为 localStorage
      pick: [], // 指定哪些状态需要持久化；🍄 [] 表示没有状态被持久化；undefined 表示所有状态都被持久化
      omit: [], // 指定哪些状态不需要持久化；🍄 [] 和 undefined 表示所有状态都被持久化
      // NOTE ... 更多配置可查看文档 https://prazdevs.github.io/pinia-plugin-persistedstate/
    },
  },
)
