/**
 * @description: 创建标签页的全局状态管理
 */
import type { LocationQueryRaw, RouteLocationNormalized } from 'vue-router'

import { filter, find, findIndex, findLastIndex, partition } from 'es-toolkit/compat'
import { cloneDeep } from 'es-toolkit/object'

// tab 的数据由对应的 路由 数据转换而成
export interface PageTab {
  /** 标签页唯一标识，使用路由数据的 name 属性 */
  key: string
  /** 标签页显示名称，使用路由数据的 meta 对象中的属性 */
  title: string
  /** 路由路径 */
  path: string
  /** 查询参数，采用的是路由的 query 参数，类型与 meta.query 一致 */
  query?: LocationQueryRaw
  /** 是否固定（不可关闭） */
  fixed?: boolean
  /** 图标配置 */
  icon?: import('@/components/custom/SvgIcon.vue').IconProps
}

export const usePageTabsStore = defineStore(
  'pageTabs-store',
  () => {
    const vueRouter = useRouter()

    /**
     * @description: 定义全局状态
     */
    const tabs = ref<PageTab[]>([]) // tabs 列表
    const activeTab = ref<string>('') // 当前激活的 tab

    /**
     * @description: 计算属性
     */
    // 当前激活 tab 的索引
    const activeTabIndex = computed(() =>
      findIndex(tabs.value, { key: activeTab.value }),
    )

    /**
     * @description: 功能函数
     */
    // Fun1️⃣ 添加标签页
    function addTab(route: RouteLocationNormalized) {
      const { name, fullPath, meta, query } = route

      const key = String(name || fullPath)

      // 如果已存在，则将当前标签页设置为激活状态
      if (find(tabs.value, { key })) {
        activeTab.value = key
        return
      }

      // 添加新标签
      const { customLabel, iconConfig } = meta?.menuProps || {}
      const newTab: PageTab = {
        key,
        path: fullPath,
        title: meta?.title || customLabel || '未命名',
        icon: iconConfig,
        fixed: false,
        query: cloneDeep(query),
      }

      // 插入逻辑：始终保持固定的标签排序在前面
      // 1. 如果当前激活的是固定标签，则插入到最后一个固定标签之后
      // 2. 否则，插入到当前激活标签之后
      // 3. 如果列表为空或未找到激活标签，默认插入到末尾
      const currentIndex = activeTabIndex.value
      const isFixed = tabs.value[currentIndex]?.fixed

      // 判断固定标签页，找最后一个固定标签的索引
      const targetIndex = isFixed
        ? findLastIndex(tabs.value, t => !!t.fixed)
        : currentIndex

      // 如果 targetIndex 为 -1 (列表为空或无匹配)，则插入到末尾（就是 0）
      const insertIndex = targetIndex === -1 ? tabs.value.length : targetIndex + 1

      tabs.value.splice(insertIndex, 0, newTab)
      activeTab.value = key
    }

    // Fun2️⃣ 关闭标签页（单个关闭）
    function closeTab(key: string, index?: number) {
      const idx = index ?? findIndex(tabs.value, { key })

      const newTabs = [...tabs.value]
      // 移除标签
      newTabs.splice(idx, 1)
      // 切换标签页
      updateTabs(newTabs, { closedIndex: idx })
    }

    // Fun3️⃣ 关闭其他标签页（批量关闭）
    function closeOtherTabs(key: string) {
      const newTabs = filter(tabs.value, tab => tab.key === key || !!tab.fixed)
      // 切换标签页
      updateTabs(newTabs, { targetKey: key })
    }

    // Fun4️⃣ 关闭左侧标签页（批量关闭）
    function closeLeftTabs(key: string, index: number) {
      // 保留：固定标签 + 当前标签及右侧所有标签
      const newTabs = filter(tabs.value, (tab, i) => !!tab.fixed || i >= index)
      // 切换标签页
      updateTabs(newTabs, { targetKey: key })
    }

    // Fun5️⃣ 关闭右侧标签页（批量关闭）
    function closeRightTabs(key: string, index: number) {
      // 保留：固定标签 + 当前标签及左侧所有标签
      const newTabs = filter(tabs.value, (tab, i) => !!tab.fixed || i <= index)
      // 切换标签页
      updateTabs(newTabs, { targetKey: key })
    }

    // Fun6️⃣ 固定/取消固定 标签页
    function toggleFixedTab(key: string, index?: number) {
      const idx = index ?? findIndex(tabs.value, { key })
      if (idx === -1)
        return

      const tab = tabs.value[idx]
      tab.fixed = !tab.fixed

      // 处理排序：固定标签排在前面
      // * 使用 lodash 的 partition 工具函数（按照条件进行分割）将固定和非固定标签分组，自动实现“固定在前，非固定在后”的排序
      const [fixedTabs, unfixedTabs] = partition(tabs.value, t => !!t.fixed)
      tabs.value = [...fixedTabs, ...unfixedTabs]
    }

    // 标签页切换 - 路由跳转
    function setActiveTab(tab: PageTab) {
      vueRouter.push({ path: tab.path, query: tab.query })
    }

    /**
     * @description: 辅助函数
     */
    // 🍄 更新标签页列表，如果当前激活的标签页被移除，则自动切换到相邻标签
    function updateTabs(
      newTabs: PageTab[],
      options: { closedIndex?: number, targetKey?: string } = {},
    ) {
      tabs.value = newTabs

      // 如果当前激活的标签不在新的列表中，说明被关闭了
      if (find(newTabs, { key: activeTab.value }))
        return

      let nextTab: PageTab | undefined

      const { closedIndex, targetKey } = options

      // 如果是 单个关闭，则切换到相邻标签
      if (typeof closedIndex === 'number') {
        // * Math.max(0, closedIndex - 1) 确保索引不小于 0
        nextTab = newTabs[Math.max(0, closedIndex - 1)]
      }

      // 如果是 批量关闭，则切换到右侧菜单所属的标签
      if (targetKey) {
        nextTab = find(newTabs, { key: targetKey })
      }

      // 跳转路由、切换标签页
      if (!nextTab)
        return

      activeTab.value = nextTab.key
      setActiveTab(nextTab)
    }

    return {
      // 状态
      tabs,
      activeTab,

      // 功能函数
      addTab,
      closeTab,
      closeOtherTabs,
      closeLeftTabs,
      closeRightTabs,
      toggleFixedTab,
      setActiveTab,
    }
  },
  {
    persist: {
      key: 'page-tabs-store',
      storage: localStorage,
      pick: ['tabs', 'activeTab', 'activeTabIndex'],
    },
  },
)
